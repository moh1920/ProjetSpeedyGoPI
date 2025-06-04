package speedy.go.speedygo.DeliveryManagement.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.DeliveryManagement.Repository.DeliveryRepository;
import speedy.go.speedygo.DeliveryManagement.Service.LocationService;
import speedy.go.speedygo.DeliveryManagement.model.Delivery;
import speedy.go.speedygo.DeliveryManagement.model.Location;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
@Slf4j
public class LocationController {

    private final LocationService locationService;
    private final DeliveryRepository deliveryRepository;

    @PostMapping("/update/{deliveryId}")
    public void updateLocation(@RequestBody Location location, @PathVariable Long deliveryId) {
        if (deliveryId == null) {
            log.error("🚫 deliveryId is null");
            return;
        }
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow();

        if (location.getClientid() != null && location.getClientid().equals(delivery.getClient().getId())) {
            locationService.sendingLocation(delivery.getCourier().getId(), delivery.getClient().getId(), location);
            log.info("📡 Sending location of {} to {}", delivery.getClient().getId(), delivery.getCourier().getId());

        }
    }

    @PostMapping("/update1/{deliveryId}")
    public void updateLocation1(@RequestBody Location location, @PathVariable Long deliveryId) {
        if (deliveryId == null) {
            log.error("🚫 deliveryId is null");
            return;
        }
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow();

        if (location.getClientid().equals(delivery.getCourier().getId())) {
            locationService.sendingLocation(delivery.getClient().getId(), delivery.getCourier().getId(), location);
            log.info("📡 Sending location of {} to {}", delivery.getCourier().getId(), delivery.getClient().getId());
        }
    }
}
