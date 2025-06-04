import {Component, OnInit, ViewChild} from '@angular/core';
import { ChartOptions } from "chart.js";
import { StatService } from "../../../../services/services/statService";
import { MonthlyTrend } from "../../../../services/models/rental-statistics.model";
import { NgChartsModule, BaseChartDirective } from "ng2-charts";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-stat-avg-duration-minutes',
  imports: [
    NgChartsModule,
    NgIf
  ],
  templateUrl: './stat-avg-duration-minutes.component.html',
  standalone: true,
  styleUrl: './stat-avg-duration-minutes.component.scss'
})
export class StatAvgDurationMinutesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Gardez une copie des données originales pour le tooltip
  originalData: MonthlyTrend[] = [];

  chartData: {
    datasets: {
      pointBackgroundColor: any[];
      borderColor: string;
      tension: number;
      pointHoverRadius: number;
      data: any[];
      label: string;
      fill: boolean;
      pointRadius: number
    }[];
    labels: any[];
  } = {
    labels: [],
    datasets: [
      {
        label: 'Durée moyenne (min)',
        data: [],
        fill: false,
        borderColor: '#007bff',
        pointBackgroundColor: [],
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          // Personnaliser le tooltip pour afficher la tendance
          afterLabel: (context) => {
            const dataIndex = context.dataIndex;
            const data = this.originalData[dataIndex];
            return `Tendance: ${data.trend}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Mois',
          color: '#666'
        }
      },
      y: {
        grid: {
          color: '#f0f0f0'
        },
        title: {
          display: true,
          text: 'Durée Moyenne (min)',
          color: '#666'
        },
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 2,
        borderColor: '#fff'
      }
    }
  };

  isLoading = false;
  errorMessage = "";

  constructor(private statService: StatService) {}

  ngOnInit(): void {
    this.getMonthlyAvgDurations();
  }

  getMonthlyAvgDurations() {
    this.isLoading = true;

    this.statService.compareMonthlyAvgDurations().subscribe({
      next: (data: MonthlyTrend[]) => {
        // Sauvegardez les données complètes
        this.originalData = data;

        this.chartData.labels = data.map(d => d.month);
        this.chartData.datasets[0].data = data.map(d => d.average);
        this.chartData.datasets[0].pointBackgroundColor = data.map(d => this.getColorByTrend(d.trend));

        // Mise à jour du graphique
        if (this.chart) {
          this.chart.update();
        }
      },
      error: (error) => {
        this.errorMessage = "Erreur lors du chargement des données.";
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getColorByTrend(trend: string): string {
    switch (trend) {
      case 'Croissance': return '#28a745';   // Vert
      case 'Décroissance': return '#dc3545'; // Rouge
      case 'Stable': return '#ffc107';       // Jaune
      default: return '#6c757d';             // Gris pour N/A
    }
  }
}
