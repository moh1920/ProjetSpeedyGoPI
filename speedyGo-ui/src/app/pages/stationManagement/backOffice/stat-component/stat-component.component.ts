import { Component, type OnInit, type AfterViewInit, type ElementRef, ViewChild } from "@angular/core";
import { NgForOf, NgIf } from "@angular/common";
import { CommonModule } from "@angular/common";
import { NgChartsModule, BaseChartDirective } from "ng2-charts";
import type { MaintenanceCountDTO } from "../../../../services/models/MaintenanceCountDTO";
import { Chart, type ChartConfiguration, type ChartData, type ChartType } from "chart.js";
import { StatService } from "../../../../services/services/statService";
import { VehicleUsageStatsDTO } from "../../../../services/models/VehicleUsageStatsDTO";
import { VehicleStatsChartComponent } from "../vehicle-stats-chart-component/vehicle-stats-chart-component.component";
import { CustomerStatsComponentComponent } from "../customer-stats-component/customer-stats-component.component";
import { StatAvgDurationMinutesComponent } from "../stat-avg-duration-minutes/stat-avg-duration-minutes.component";
import {StatMaintenanceVehicleComponent} from "../stat-maintenance-vehicle/stat-maintenance-vehicle.component";
import {VehicleRentalStationListComponent} from "../vehicle-rental-station-list/vehicle-rental-station-list.component";

@Component({
  selector: "app-stat-component",
  imports: [
    NgIf,
    NgForOf,
    CommonModule,
    NgChartsModule,
    VehicleStatsChartComponent,
    CustomerStatsComponentComponent,
    StatAvgDurationMinutesComponent,
    StatMaintenanceVehicleComponent,
    VehicleRentalStationListComponent
  ],
  templateUrl: "./stat-component.component.html",
  standalone: true,
  styleUrls: ["./stat-component.component.scss"],
})
export class StatComponentComponent  {

}
