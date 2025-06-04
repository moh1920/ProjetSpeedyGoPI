import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp, IMessage } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { GoogleMap } from '@angular/google-maps';
import { KeycloakService } from '../../utils/keycloak/keycloak.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-livreur-tracker',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, NavbarComponent],
  templateUrl: './livreur-tracker.component.html',
  styleUrls: ['./livreur-tracker.component.scss']
})
export class LivreurTrackerComponent implements OnInit, OnDestroy {
  delivery: any[] = [];
  notAssignedOrders: any[] = [];

  livreurPosition = { lat: 36.897922, lng: 10.190753 };
  clientPosition = { lat: 0, lng: 0 };

  mapCenter = { lat: 0, lng: 0 };
  zoom = 15;
  initialCentered = false;

  routeDistance = '';
  routeDuration = '';
  progressValue = 0;

  SocketClient: any;
  subscription: any = null;
  intervalId: any = null;
  refreshOrdersInterval: any = null;

  directionsRenderer?: google.maps.DirectionsRenderer;

  mapOptions = {
    gestureHandling: 'greedy',
    disableDoubleClickZoom: true,
  };

  livreurIcon = {
    url: '/assets/livreurcarimg.png',
    scaledSize: new google.maps.Size(60, 40)
  };

  ClientIcon = {
    url: '/assets/avatar-men.png',
    scaledSize: new google.maps.Size(40, 40)
  };

  @ViewChild(GoogleMap) mapRef!: GoogleMap;
  receivedFromWS: boolean = false;
  wsTimeout: any = null;
  active: boolean = false;
  constructor(private http: HttpClient, private keycloak: KeycloakService) {}

  ngOnInit(): void {    const userId = this.keycloak.userId;
    this.fetchUnassignedOrders();
    this.connectWebSocket(userId);

    this.refreshOrdersInterval = setInterval(() => this.fetchAssignedDeliveries(), 10000);

    this.intervalId = setInterval(() => this.sendLocation(userId), 3000);
    this.refreshOrdersInterval = setInterval(() => this.fetchUnassignedOrders(), 5000);
  }

  get activeDeliveries() {
    return this.delivery.filter(d => d.status !== 'LIVRED');
  }

 checkclientLocation() {
    if (this.clientPosition.lat===0 && this.clientPosition.lng===0) {
      this.active = false;
    }
  }


  fetchAssignedDeliveries() {
    const userId = this.keycloak.userId;
    this.http.get<any[]>(`http://localhost:8020/api/deliveries/delivery/courier/${userId}`)
      .subscribe({
        next: (data) => {
          this.delivery = data.filter(d => d.status !== 'LIVRED');

/*          if (this.active) {
            const lat = parseFloat(this.activeDeliveries[0].deliveryLatitude);
            const lng = parseFloat(this.activeDeliveries[0].deliveryLongitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              this.clientPosition = { lat, lng };
            }
          }*/
          this.calculateOptimizedRoute();
        },
        error: (err) => console.error('Failed to fetch deliveries:', err)
      });
  }
  fetchUnassignedOrders() {
    this.http.get<any[]>(`http://localhost:8020/api/deliveries/ordersnotassigned`)
      .subscribe({
        next: (data) => this.notAssignedOrders = data,
        error: (err) => console.error('Failed to fetch unassigned orders:', err)
      });
  }

  // ✅ Client location via WebSocket OR fallback to delivery coordinates
  connectWebSocket(userId: string) {
    const ws = new SockJS('http://localhost:8020/ws');
    this.SocketClient = Stomp.over(ws);

    this.SocketClient.connect({}, () => {
      this.subscription = this.SocketClient.subscribe(`/user/${userId}/location`, (msg: IMessage) => {
        console.log("📩 WebSocket message received:", msg.body);

        const location = JSON.parse(msg.body);
        const lat = parseFloat(location.latitude);
        const lng = parseFloat(location.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          this.clientPosition = { lat, lng };
          this.active = true;
          this.receivedFromWS = true;
        } else if (this.activeDeliveries.length > 0) {
          const fallbackLat = parseFloat(this.activeDeliveries[0].deliveryLatitude);
          const fallbackLng = parseFloat(this.activeDeliveries[0].deliveryLongitude);
          if (!isNaN(fallbackLat) && !isNaN(fallbackLng)) {
            this.clientPosition = { lat: fallbackLat, lng: fallbackLng };
          }
        }

        console.log("📍 Updated client position:", this.clientPosition);
        if (this.wsTimeout) {
          console.log(this.wsTimeout);
          clearTimeout(this.wsTimeout);
        }

        this.wsTimeout = setTimeout(() => {
          console.warn("⚠️ No WebSocket message for 10 seconds, setting receivedFromWS = false");
          this.receivedFromWS = false;
        }, 10000); // 10 seconds

        this.calculateOptimizedRoute();
      });
    });
  }


  sendLocation(userId: string) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (!isNaN(lat) && !isNaN(lng)) {
        const loc = {
          clientid: userId,
          latitude: lat,
          longitude: lng
        };

        this.livreurPosition = { lat, lng };

        if (!this.initialCentered) {
          this.mapCenter = this.livreurPosition;
          this.initialCentered = true;
        }

        if (this.activeDeliveries.length > 0) {
          fetch(`http://localhost:8020/api/location/update1/${this.activeDeliveries[0].id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loc)
          });
        }

        this.calculateOptimizedRoute();
      }
    });
  }

  optimizeRoute(start: { lat: number, lng: number }, deliveries: any[]) {
    const payload = {
      start,
      deliveries: deliveries.map(d => ({
        pickup: { lat: Number(d.pickupLatitude), lng: Number(d.pickupLongitude) },
        dropoff: { lat: Number(d.deliveryLatitude), lng: Number(d.deliveryLongitude) }
      }))
    };
    return this.http.post<{ route: { lat: number, lng: number }[] }>('https://3dhlnfdv-8000.euw.devtunnels.ms/optimize-route', payload);

  }

  calculateOptimizedRoute() {
    if (this.activeDeliveries.length === 0) return;

    // Si la position du client est connue (différente de 0,0), on l'utilise pour remplacer la position de livraison dans la route
    const enhancedDeliveries = this.activeDeliveries.map(delivery => {
      const clientLat = this.clientPosition.lat;
      const clientLng = this.clientPosition.lng;

      const deliveryLat = !isNaN(Number(clientLat)) && clientLat !== 0 ? clientLat : Number(delivery.deliveryLatitude);
      const deliveryLng = !isNaN(Number(clientLng)) && clientLng !== 0 ? clientLng : Number(delivery.deliveryLongitude);

      return {
        ...delivery,
        deliveryLatitude: deliveryLat,
        deliveryLongitude: deliveryLng
      };
    });

    this.optimizeRoute(this.livreurPosition, enhancedDeliveries).subscribe({
      next: (response) => {
        const route = response.route;
        if (!this.directionsRenderer) {
          this.directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
          this.directionsRenderer.setMap(this.mapRef.googleMap!);
        }

        if (route.length < 2) return;

        const origin = { lat: route[0].lat, lng: route[0].lng };
        const destination = { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng };
        const waypoints = route.slice(1, -1).map(p => ({
          location: { lat: p.lat, lng: p.lng },
          stopover: true
        }));

        new google.maps.DirectionsService().route({
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === 'OK' && result) {
            this.directionsRenderer!.setDirections(result);
            const legs = result.routes[0].legs;
            let totalDistance = 0, totalDuration = 0;
            for (const leg of legs) {
              totalDistance += leg.distance?.value || 0;
              totalDuration += leg.duration?.value || 0;
            }
            this.routeDistance = (totalDistance / 1000).toFixed(2) + ' km';
            this.routeDuration = Math.ceil(totalDuration / 60) + ' mins';
            this.progressValue = Math.min(100, Math.max(0, (1 - totalDistance / 10000) * 100));
          } else {
            console.error('❌ Directions failed:', status);
          }
        });
      },
      error: (err) => console.error('❌ Erreur d\'optimisation du chemin:', err)
    });
  }

  updateDeliveryStatus(deliveryId: number, status: string) {
    this.http.post<any>(`http://localhost:8020/api/deliveries/pickup/${deliveryId}/${status}`, {})
      .subscribe({
        next: () => this.fetchAssignedDeliveries(),
        error: (err) => console.error(`❌ Failed to update status ${status}`, err)
      });
  }

  assignOrder(orderId: number) {
    const userId = this.keycloak.userId;
    this.http.post(`http://localhost:8020/api/deliveries/assign?orderId=${orderId}&courierId=${userId}`, {})
      .subscribe({
        next: () => this.fetchAssignedDeliveries(),
        error: (err) => console.error('❌ Failed to assign order:', err)
      });
  }
  getClientOrDeliveryMarkers() {
    if (!this.receivedFromWS) {

      return this.activeDeliveries.map(d => ({
        lat: +d.deliveryLatitude,
        lng: +d.deliveryLongitude
      }));
    }
    else return [];
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.SocketClient?.disconnect();
    clearInterval(this.intervalId);
    clearInterval(this.refreshOrdersInterval);
  }



}
