import { Component, type OnInit, ViewChild } from "@angular/core"
import { NgIf, NgForOf } from "@angular/common"
import { CommonModule } from "@angular/common"
import { BaseChartDirective, NgChartsModule } from "ng2-charts"
import { Chart, type ChartConfiguration, type ChartData, type ChartType } from "chart.js"

// Register required Chart.js components
import { BarController, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { VehicleUsageStatsDTO } from "../../../../services/models/VehicleUsageStatsDTO"
import { StatService } from "../../../../services/services/statService"
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Title, Tooltip)

@Component({
  selector: "app-vehicle-stats-chart",
  standalone: true,
  imports: [NgIf, NgForOf, CommonModule, NgChartsModule],
  templateUrl: "./vehicle-stats-chart-component.component.html",
  styleUrls: ["vehicle-stats-chart-component.component.scss"],
})
export class VehicleStatsChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined

  vehicleStats: VehicleUsageStatsDTO[] = []
  errorMessage = ""

  // Chart colors
  rentalCountColor = "rgba(54, 162, 235, 1)"
  mileageColor = "rgba(75, 192, 192, 1)"

  // Chart type
  public barChartType: ChartType = "bar"

  // Chart options
  public barChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          precision: 0,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Mileage (km)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset || ""; // Ensure dataset label is a string
            const value = context.parsed.y;

            // Check if the label includes "Mileage" or "Rental"
            return `${datasetLabel}: ${value}`;
          },
          footer: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            const stats = this.vehicleStats[index];

            if (stats && stats.lastMaintenance) {
              return [`Last Maintenance: ${new Date(stats.lastMaintenance).toLocaleDateString()}`];
            } else {
              return ["No maintenance record"];
            }
          },
        },
      },
    },
  }

  // Chart data
  public barChartData: ChartData<"bar"> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Rental Count",
        backgroundColor: [],
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
      {
        data: [],
        label: "Mileage (km)",
        backgroundColor: this.mileageColor,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  }

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.loadVehicleStats()
  }

  loadVehicleStats(): void {
    this.statService.getVehicleUsageAndMaintenanceStats().subscribe({
      next: (data) => {
        this.vehicleStats = data
        this.updateChartData()
      },
      error: (err) => {
        this.errorMessage = err
      },
    })
  }

  updateChartData(): void {
    if (!this.vehicleStats || this.vehicleStats.length === 0) return

    // Sort vehicles by ID for consistent display
    const sortedStats = [...this.vehicleStats].sort((a, b) => a.vehicleId - b.vehicleId)

    // Update labels
    this.barChartData.labels = sortedStats.map((stat) => `Vehicle ${stat.vehicleId}`)

    // Update rental count data
    this.barChartData.datasets[0].data = sortedStats.map((stat) => stat.rentalCount)

    // Set colors based on maintenance status
    this.barChartData.datasets[0].backgroundColor = sortedStats.map((stat) =>
      stat.lastMaintenance ? this.rentalCountColor : "rgba(54, 162, 235, 0.5)",
    )

    // Update mileage data
    this.barChartData.datasets[1].data = sortedStats.map((stat) => stat.mileage)

    // Update the chart
    if (this.chart) {
      this.chart.update()
    }
  }
}
