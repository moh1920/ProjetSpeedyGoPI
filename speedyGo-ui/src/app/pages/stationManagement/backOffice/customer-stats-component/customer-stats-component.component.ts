import { Component, OnInit, ViewChild } from '@angular/core';
import { StatService } from "../../../../services/services/statService";
import { CustomerRentalStats } from "../../../../services/models/CustomerRentalStats";
import {BaseChartDirective, NgChartsModule} from "ng2-charts";
import { NgIf, NgFor, DatePipe, DecimalPipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-customer-stats-component',
  standalone: true,
  imports: [NgChartsModule, NgIf, NgFor, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './customer-stats-component.component.html',
  styleUrl: './customer-stats-component.component.scss'
})
export class CustomerStatsComponentComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  customerData: CustomerRentalStats[] = [];
  filteredData: CustomerRentalStats[] = [];

  // Chart type selector
  chartType: ChartType = 'scatter';
  selectedChartView: 'scatter' | 'bubble' | 'bar' = 'scatter';
  selectedMetric: 'costDistance' | 'costFrequency' = 'costDistance';

  // Filters
  minCost: number | null = null;
  maxCost: number | null = null;
  minDistance: number | null = null;
  maxDistance: number | null = null;
  customerSearch: string = '';

  // Stats
  averageCost: number = 0;
  averageDistance: number = 0;
  totalCustomers: number = 0;

  // Chart data - we'll use a generic data structure and update it based on the selected chart type
  chartData: any = {
    datasets: []
  };

  // Options for scatter/bubble chart
  scatterChartOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const label = ctx.dataset.label || '';
            return `${label}: ${ctx.raw.x.toFixed(2)} TND, ${ctx.raw.y.toFixed(2)} km`;
          }
        }
      },
      title: {
        display: true,
        text: 'Customer Rental Costs vs. Distance'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Total Cost (TND)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Distance (km)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)'
        }
      }
    }
  };

  // Options for bar chart
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Customer Rental Summary'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // Combined options - we'll select which to use based on the chart type
  chartOptions: any = this.scatterChartOptions;

  public isLoading = false;
  public errorMessage = "";

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.getCustomerStats();
  }

  getCustomerStats() {
    this.isLoading = true;

    this.statService.getCustomerStats().subscribe({
      next: (data: CustomerRentalStats[]) => {
        this.customerData = data;
        this.calculateStats();
        this.applyFilters();
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du chargement des statistiques clients.";
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    if (this.customerData.length === 0) return;

    this.totalCustomers = this.customerData.length;
    this.averageCost = this.customerData.reduce((sum, customer) => sum + customer.totalCost, 0) / this.totalCustomers;
    this.averageDistance = this.customerData.reduce((sum, customer) => sum + customer.totalDistance, 0) / this.totalCustomers;
  }

  applyFilters() {
    this.filteredData = this.customerData.filter(customer => {
      let matchesCost = true;
      let matchesDistance = true;
      let matchesSearch = true;

      if (this.minCost !== null) {
        matchesCost = matchesCost && customer.totalCost >= this.minCost;
      }
      if (this.maxCost !== null) {
        matchesCost = matchesCost && customer.totalCost <= this.maxCost;
      }
      if (this.minDistance !== null) {
        matchesDistance = matchesDistance && customer.totalDistance >= this.minDistance;
      }
      if (this.maxDistance !== null) {
        matchesDistance = matchesDistance && customer.totalDistance <= this.maxDistance;
      }
      if (this.customerSearch.trim() !== '') {
        matchesSearch = customer.customerEmail.toLowerCase().includes(this.customerSearch.toLowerCase());
      }

      return matchesCost && matchesDistance && matchesSearch;
    });

    this.updateCharts();
  }

  updateCharts() {
    if (this.selectedMetric === 'costDistance') {
      this.updateScatterOrBubbleChart();
      this.chartType = this.selectedChartView === 'bar' ? 'bar' : this.selectedChartView as ChartType;
      this.chartOptions = this.scatterChartOptions;
    } else {
      this.updateBarChart();
      this.chartType = 'bar';
      this.chartOptions = this.barChartOptions;
    }

    if (this.chart) {
      this.chart.update();
    }
  }

  updateScatterOrBubbleChart() {
    // Assign colors based on customer ID to ensure consistency
    const colorMap = new Map<string, string>();

    this.filteredData.forEach(customer => {
      if (!colorMap.has(customer.customerEmail)) {
        colorMap.set(customer.customerEmail, this.generateColor(customer.customerEmail));
      }
    });

    if (this.selectedChartView === 'scatter' || this.selectedChartView === 'bubble') {
      this.chartData = {
        datasets: this.filteredData.map(customer => {
          const dataset: any = {
            label: customer.customerEmail,
            pointBackgroundColor: colorMap.get(customer.customerEmail),
            pointBorderColor: colorMap.get(customer.customerEmail),
            showLine: false,
          };

          if (this.selectedChartView === 'scatter') {
            dataset.data = [{ x: customer.totalCost, y: customer.totalDistance }];
          } else { // bubble
            dataset.data = [{
              x: customer.totalCost,
              y: customer.totalDistance,
              r: Math.max(5, Math.sqrt(customer.totalDistance || 1) * 3) // Scale bubble size based on rental count
            }];
          }

          return dataset;
        })
      };
    }
  }

  updateBarChart() {
    // Top 10 customers by cost or other criteria
    const topCustomers = [...this.filteredData]
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10);

    this.chartData = {
      labels: topCustomers.map(c => this.truncateEmail(c.customerEmail)),
      datasets: [
        {
          data: topCustomers.map(c => c.totalCost),
          label: 'Total Cost (TND)',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          data: topCustomers.map(c => c.totalDistance),
          label: 'Total Distance (km)',
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  truncateEmail(email: string): string {
    if (email.length > 15) {
      return email.substring(0, 12) + '...';
    }
    return email;
  }

  generateColor(seed: string): string {
    // Generate a deterministic color based on the customer email
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 50%)`;
  }

  onChartViewChange() {
    this.updateCharts();
  }

  onMetricChange() {
    this.updateCharts();
  }

  clearFilters() {
    this.minCost = null;
    this.maxCost = null;
    this.minDistance = null;
    this.maxDistance = null;
    this.customerSearch = '';
    this.applyFilters();
  }
}
