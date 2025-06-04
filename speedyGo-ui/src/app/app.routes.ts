import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { HomeComponent } from './pages/home/home.component';
import {ForumComponent} from "./pages/forum/forum.component";

import {MyProfileForumComponent} from "./components/my-profile-forum/my-profile-forum.component";
import {PromotionEventListComponent} from "./components/promotion-event-list/promotion-event-list.component";
import {PromotionEventFormComponent} from "./components/promotion-event-form/promotion-event-form.component";
import {PromotionEventDetailsComponent} from "./components/promotion-event-details/promotion-event-details.component";
import {BlogFormComponent} from "./components/blog-form/blog-form.component";
import { AddProductComponent } from './PRODUCT/add-product/add-product.component';
import { ShowProductComponent } from './PRODUCT/show-product/show-product.component';
import { DetailProductComponent } from './PRODUCT/detail-product/detail-product.component';
import { DeleteProductComponent } from './PRODUCT/delete-product/delete-product.component';
import { PanierComponent } from './panier/panier.component';
import { StoreFormComponent } from './STORE/store-form/store-form.component';
import { UpdateProductComponent } from './PRODUCT/update-product/update-product.component';
import { StorePageComponent } from './STORE/store-page/store-page.component';
import { OrdersComponent } from './ORDER/orders/orders.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { StoreTemplateComponent } from './STORE/store-template/store-template.component';
import { QrCodeScannerComponentTsComponent } from './pages/stationManagement/frontOffice/qr-code-scanner.component.ts/qr-code-scanner.component.ts.component';
import {
  FormVehicleRentalComponent
} from "./pages/stationManagement/backOffice/form-vehicle-rental/form-vehicle-rental.component";
import {
  ListVahicleRantalComponent
} from "./pages/stationManagement/backOffice/list-vahicle-rantal/list-vahicle-rantal.component";
import {
  DetailsVehicleRentalComponent
} from "./pages/stationManagement/backOffice/details-vehicle-rental/details-vehicle-rental.component";
import {
  FormStationVehicleComponent
} from "./pages/stationManagement/backOffice/form-station-vehicle/form-station-vehicle.component";
import {
  StationVehicleListComponent
} from "./pages/stationManagement/backOffice/station-vehicle-list/station-vehicle-list.component";
import {
  UpdateStationVehicleComponent
} from "./pages/stationManagement/backOffice/update-station-vehicle/update-station-vehicle.component";
import {
  FormMaintenanceComponent
} from "./pages/stationManagement/backOffice/form-maintenance/form-maintenance.component";
import {
  ListMaintenanceComponent
} from "./pages/stationManagement/backOffice/list-maintenance/list-maintenance.component";
import {
  UpdateMaintenanceComponent
} from "./pages/stationManagement/backOffice/update-maintenance/update-maintenance.component";
import {
  UpdateVehicleRentalComponent
} from "./pages/stationManagement/backOffice/update-vehucle-rental/update-vehucle-rental.component";
import {
  ListScooterBikeComponent
} from "./pages/stationManagement/frontOffice/list-scooter-bike/list-scooter-bike.component";
import {
  DetaisScooterOrBikeComponent
} from "./pages/stationManagement/frontOffice/detais-scooter-or-bike/detais-scooter-or-bike.component";
import {
  HomeRentalScooterComponent
} from "./pages/stationManagement/frontOffice/pageHome/home-rental-scooter/home-rental-scooter.component";
import {
  RentalVehicleListComponent
} from "./pages/stationManagement/backOffice/rental-vehicle-list/rental-vehicle-list.component";

import {
  AddRentalVehicleComponent
} from "./pages/stationManagement/frontOffice/add-rental-vehicle/add-rental-vehicle.component";
import { CarpoolingFormComponent } from './pages/carpooling-form/carpooling-form.component';
import {FormTaxiComponent} from "./pages/form-taxi/form-taxi.component";

import { ReservationCarpoolComponent } from './pages/reservation-carpool/reservation-carpool.component';
import { ListRequestedCarpoolComponent } from './pages/list-requested-carpool/list-requested-carpool.component';
import { ListCarpoolOfferComponent } from './pages/list-carpool-offer/list-carpool-offer.component';
import { TaxiFormComponent } from './pages/taxi-form/taxi-form.component';
import { TaxiListComponent } from './pages/taxi-list/taxi-list.component';
import { TaxiBookingComponent } from './pages/taxi-booking/taxi-booking.component';
import { ListTaxiBookingComponent } from './pages/list-taxi-booking/list-taxi-booking.component';
import { StationListComponent } from './back-office/Station Delivery/station-list/station-list.component';
import {StationFormComponent} from "./back-office/Station Delivery/station-form/station-form.component";
import {StationDetailsComponent} from "./back-office/Station Delivery/station-details/station-details.component";
import { DeliveryStationsComponent } from "./pages/staion-delivery/staion-delivery.component";
import { SpeedyGoPlusComponent } from './pages/speedy-go-plus/speedy-go-plus.component';
import { SubscriptionManagementComponent } from './back-office/subscription-managment/subscription-managment.component';
import { SubscriptionFormComponent } from './back-office/subscription-form/subscription-form.component';
import { PaypalPayComponent } from './components/paypal-pay/paypal-pay.component';
import { PaymentComponent } from './components/payment/payment.component';
import {ChatComponent} from "./chat/chat.component";
import {LoyaltyProgramComponent} from "./components/loyalty-program/loyalty-program.component";
import {LoyalProgramDetailsComponent} from "./components/loyal-program-details/loyal-program-details.component";import {StatsComponent} from "./stats/stats/stats.component";
import {SpinComponent} from "./components/spin/spin.component";
import {TendanceRestaurantsComponent} from "./components/tendance-restaurants/tendance-restaurants.component";
import {PollCreateComponent} from "./components/poll/poll-create/poll-create.component";
import {PollListComponent} from "./components/poll/poll-list/poll-list.component";
import {PollResultsComponent} from "./components/poll/poll-results/poll-results.component";
import {StatComponentComponent} from "./pages/stationManagement/backOffice/stat-component/stat-component.component";
import {
  VehicleStatsChartComponent
} from "./pages/stationManagement/backOffice/vehicle-stats-chart-component/vehicle-stats-chart-component.component";
import {
  StatAvgDurationMinutesComponent
} from "./pages/stationManagement/backOffice/stat-avg-duration-minutes/stat-avg-duration-minutes.component";
import {
  CustomerStatsComponentComponent
} from "./pages/stationManagement/backOffice/customer-stats-component/customer-stats-component.component";
import {
  TripRecommandationComponantComponent
} from "./pages/stationManagement/frontOffice/trip-recommandation-componant/trip-recommandation-componant.component";
import {
  CustmerProfileRentalComponent
} from "./pages/stationManagement/frontOffice/custmer-profile-rental/custmer-profile-rental.component";
import {ClientDeliveriesComponent} from "./components/client-deliveries/client-deliveries.component";
import {TrackOrderComponent} from "./components/track-order/track-order.component";
import {LivreurTrackerComponent} from "./components/livreur-tracker/livreur-tracker.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {RoleRequestService} from "./adminManagement/role-request.service";
import {RoleRequestComponent} from "./adminManagement/role-request/role-request.component";
import {RoleResponseComponent} from "./adminManagement/role-response/role-response.component";
import {AlllivreurComponent} from "./back-office/alllivreur/alllivreur.component";


export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      }, {
        path: 'stations',
        component: StationListComponent,
      },
      { path: 'stations/add', component: StationFormComponent },
      { path: 'stations/edit/:id', component: StationFormComponent },
      { path: 'stations/details/:id', component: StationDetailsComponent },
      { path: 'subscripion-managments', component: SubscriptionManagementComponent },
      { path: 'subscripion-managments/add', component: SubscriptionFormComponent },
      { path: 'subscripion-managments/edit/:id', component: SubscriptionFormComponent }      ,{
        path:'scannerQrCode',component: QrCodeScannerComponentTsComponent
      },  {path:'test',component:AlllivreurComponent}
      ,  {path:'chat/:id',component:ChatComponent},

      {
        path:'maintenanceVehicleList',component: ListMaintenanceComponent
      },
      {
        path:'customerStats',component: CustomerStatsComponentComponent
      },
      {
        path:'rentalVehicleList',component: RentalVehicleListComponent
      },
      {
        path:'addVehicleRental',component: FormVehicleRentalComponent
      },
      {
        path:'VehicleRentalList',component: ListVahicleRantalComponent
      },{
        path:'detailsVehicleRental/:id',component: DetailsVehicleRentalComponent
      },{
        path:'statAvgDurationMinutes',component: StatAvgDurationMinutesComponent
      },
      {
        path:'addStationVehicle',component: FormStationVehicleComponent
      },
      {
        path:'stationVehicleList',component: StationVehicleListComponent
      },
      {
        path:'updateStationVehicleRental/:id',component: UpdateStationVehicleComponent
      },
      {
        path:'addMaintenance',component: FormMaintenanceComponent
      },
      {
        path:'updateMaintenance/:id',component: UpdateMaintenanceComponent
      },{
        path:'updateVehicleRental/:id',component: UpdateVehicleRentalComponent
      },

      {
        path:'statStationManager',component: StatComponentComponent
      },
      {
        path:'statVehicleStatsChartComponent',component: VehicleStatsChartComponent
      },


      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path:'pv',component: PromotionEventListComponent
      },
      {
        path:'pv/add',component: PromotionEventFormComponent
      },
      {
        path:'pv/edit/:id',component: PromotionEventFormComponent
      },
      {
        path:'pv/details/:id',component: PromotionEventDetailsComponent
      },
     // {path: 'chat', component: ChatComponent},
      {path: 'loyaltyPrograms', component: LoyaltyProgramComponent},
      {path: 'loyaltyProgram/details/:id', component: LoyalProgramDetailsComponent},
      {path:'role-response',component:RoleResponseComponent},
      {path:'stats',component:StatsComponent},




      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path:'home',component: HomeComponent
  },
  {
    path:'forum',component: ForumComponent
  },
  {
    path:'blog/add-post',component: BlogFormComponent
  },
  {
    path:'blog/edit-post/:id',component: BlogFormComponent
  },

  {
    path:'profile-forum',component: MyProfileForumComponent
  },
  /////////////////////
  {
    path: 'addProduct',
    component: AddProductComponent
  },
  {
    path: 'ProductList',
    component: ShowProductComponent
  },
  { path: 'detail-product/:id', component: DetailProductComponent },
  { path: 'delete-product/:id', component: DeleteProductComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'create-store', component: StoreFormComponent },
 // { path: 'store/:id', component: StoreTemplateComponent },
  { path: '', redirectTo: '/create-store', pathMatch: 'full' },
  { path: 'update-product/:id', component: UpdateProductComponent },
  { path: 'FormStore', component: StoreFormComponent },
  { path: 'store/:id', component: StorePageComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'checkout', component: CheckoutComponent },

////////////////////////////
  {
    path:'scooterBikeList',component: ListScooterBikeComponent
  },{
    path:'detaitsScooterBikeList/:id',component: DetaisScooterOrBikeComponent
  },{
    path:'homeFrontVehicleRental',component: HomeRentalScooterComponent
  },{
    path:'rentalVehicle/:id',component: AddRentalVehicleComponent
  },{
    path:'TripRecommandationComponantComponent/:id',component: TripRecommandationComponantComponent
  },{
    path:'customerScooterBike',component: CustmerProfileRentalComponent
  },
///////////////////////////////
{path: 'addOfferCarpool', component: CarpoolingFormComponent},
{path: 'listCarpoolOffers', component: ListCarpoolOfferComponent},

{path: 'addTaxi', component: TaxiFormComponent},
{path: 'listTaxi', component: TaxiListComponent},
{path: 'bookingTaxi', component: TaxiBookingComponent},
{path: 'listBookingTaxi', component: ListTaxiBookingComponent},
/////////////////////////////////////


  {
  path: 'stationss',
  component: DeliveryStationsComponent,
},

{
  path: 'pay/:id',
  component: PaymentComponent,
},

  {
    path: 'delivery',
    component: ClientDeliveriesComponent,
  },
  {
    path: 'tracking/:id',
    component: TrackOrderComponent,
  },
  { path: 'speedy-go-plus', component: SpeedyGoPlusComponent },
  {
    path: 'livreur-tracker',
    component: LivreurTrackerComponent,
  },  {path:'spin',component:SpinComponent},
  {path: 'chat', component: ChatComponent},


  { path: 'template', component: StoreTemplateComponent },
  {path:'tendance',component:TendanceRestaurantsComponent},
  //////////////////////////
  {path:'create-poll',component:PollCreateComponent},
  {path:'poll-list',component:PollListComponent},
  {path:'poll-result/:pollId',component:PollResultsComponent},
  {path:'calendar',component:CalendarComponent},
  {path:'role-request',component:RoleRequestComponent},

  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
