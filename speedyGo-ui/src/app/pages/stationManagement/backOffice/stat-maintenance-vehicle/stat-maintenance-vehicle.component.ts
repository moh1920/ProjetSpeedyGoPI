import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective, NgChartsModule} from "ng2-charts";
import type {MaintenanceCountDTO} from "../../../../services/models/MaintenanceCountDTO";
import type {ChartConfiguration, ChartType} from "chart.js";
import {VehicleUsageStatsDTO} from "../../../../services/models/VehicleUsageStatsDTO";
import {StatService} from "../../../../services/services/statService";
import {Chart} from "chart.js";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-stat-maintenance-vehicle',
  imports: [
    NgChartsModule,
    NgIf
  ],
  templateUrl: './stat-maintenance-vehicle.component.html',
  standalone: true,
  styleUrl: './stat-maintenance-vehicle.component.scss'
})
export class StatMaintenanceVehicleComponent implements OnInit, AfterViewInit{
  @ViewChild("pieChart") pieChartCanvas: ElementRef;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  maintenanceCounts: MaintenanceCountDTO[] = [];
  errorMessage = "";
  totalMaintenances = 0;
  trendingPercentage = 5.2; // Example value, replace with actual calculation

  // Chart type
  public pieChartType: ChartType = "pie";

  // Chart colors
  chartColors: string[] = [
    "hsl(215, 100%, 50%)",
    "hsl(142, 76%, 36%)",
    "hsl(0, 84%, 60%)",
    "hsl(270, 70%, 60%)",
    "hsl(30, 90%, 50%)",
  ];

  // Pie chart configuration
  public pieChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw as number;
            return `${label}: ${value} maintenances`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 5,
      },
    },
  };

  // Chart data structure - using explicit type
  public pieChartData: {
    datasets: {
      backgroundColor: string[];
      data: any[];
      hoverBackgroundColor: string[];
      hoverOffset: number;
      cutout: string;
    }[];
    labels: any[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: this.chartColors,
        hoverBackgroundColor: this.chartColors.map((color) => color.replace(")", ", 0.8)")),
        hoverOffset: 10,
        cutout: "60%",
      },
    ],
  };

  vehicleStats: VehicleUsageStatsDTO[] = [];

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.loadMaintenanceData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.addCenterText(), 500);
  }

  loadMaintenanceData(): void {
    this.statService.getMaintenanceCount().subscribe({
      next: (data) => {
        this.maintenanceCounts = data;

        // Format data for the chart
        this.pieChartData.labels = this.maintenanceCounts.map((item) => `Vehicle ${item.vehicleId}`);
        this.pieChartData.datasets[0].data = this.maintenanceCounts.map((item) => item.maintenanceCount);

        // Calculate total maintenances
        this.totalMaintenances = this.maintenanceCounts.reduce((sum, item) => sum + item.maintenanceCount, 0);

        // Update the chart
        if (this.chart) {
          this.chart.update();
        }

        // Add center text after data is loaded
        setTimeout(() => this.addCenterText(), 500);
      },
      error: (error) => {
        this.errorMessage = "Error while loading data.";
        console.error(error);
      },
    });
  }

  // Add text in the center of the donut chart
  addCenterText(): void {
    if (!this.pieChartCanvas) return;

    const chartInstance = Chart.getChart(this.pieChartCanvas.nativeElement);
    if (!chartInstance) return;

    const ctx = chartInstance.ctx;
    const centerX = chartInstance.width / 2;
    const centerY = chartInstance.height / 2;

    ctx.restore();
    ctx.font = "bold 24px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText(this.totalMaintenances.toLocaleString(), centerX, centerY);

    ctx.font = "14px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText("Maintenances", centerX, centerY + 24);
    ctx.save();
  }

}
