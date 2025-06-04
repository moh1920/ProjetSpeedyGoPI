import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StatsService } from "../services/stats.service";
import { BaseChartDirective } from "ng2-charts";
import { DatePipe, NgForOf } from "@angular/common";
import {
  Chart, ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';
import { SpinHistoryWithUserDTO, SpinService } from "../../components/spin/services/spin.service";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-stats',
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './stats.component.html',
  standalone: true,
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements AfterViewInit,OnInit{
   activePromotions!: number;
   expiredPromotions!: number;
   activeLoyaltyProgram!: number;
   usersWhoWonPointsCount!: number;
   usersWhoWonPromosCount!: number;
   top5LoyalUsers: any[] = [];
   spinHistoriesThisWeek: SpinHistoryWithUserDTO[] = [];
   spinsPerDay: { [date: string]: number } = {};

   constructor(private statsService: StatsService, private spinService: SpinService) {}

   ngOnInit(): void {
     this.loadStats();
     this.loadSpinHistory();
   }

   ngAfterViewInit(): void {
     setTimeout(() => this.renderCharts(), 500);
   }

   loadStats() {
     this.statsService.getGlobalPromotionStats().subscribe(stats => {
       this.activePromotions = stats['active'];
       this.expiredPromotions = stats['expired'];
     });
     this.statsService.getActiveLoyaltyPrograms().subscribe(val => this.activeLoyaltyProgram = val);
     this.statsService.getUsersWhoWonPointsCount().subscribe(val => this.usersWhoWonPointsCount = val);
     this.statsService.getUsersWhoWonPromosCount().subscribe(val => this.usersWhoWonPromosCount = val);
     this.statsService.getTop5LoyalUsers().subscribe(data => this.top5LoyalUsers = data);
   }

   renderCharts() {
     const promotionConfig: ChartConfiguration<'doughnut', number[], string> = {
       type: 'doughnut',
       data: {
         labels: ['Active', 'Expired'],
         datasets: [{
           data: [this.activePromotions, this.expiredPromotions],
           backgroundColor: ['#198754', '#dc3545']
         }]
       },
       options: {
         responsive: true,
         plugins: {
           legend: { position: 'bottom' }
         }
      }
     };

     try {
       new Chart('promotionChart', promotionConfig);
     } catch (error) {
       console.error('Erreur lors de la création du graphique des promotions:', error);
     }

     const usersChartConfig: ChartConfiguration<'bar', number[], string> = {
       type: 'bar',
       data: {
         labels: ['Points Earners', 'Promo Winners', 'Active Programs'],
         datasets: [{
           label: 'Count',
           data: [this.usersWhoWonPointsCount, this.usersWhoWonPromosCount, this.activeLoyaltyProgram],
           backgroundColor: ['#0d6efd', '#ffc107', '#20c997']
         }]
       },
       options: {
         responsive: true,
         scales: {
           y: { beginAtZero: true }
         }
       }
     };

     try {
       new Chart('usersChart', usersChartConfig);
     } catch (error) {
       console.error('Erreur lors de la création du graphique des utilisateurs:', error);
     }
   }

  renderSpinChart() {
    const labels = Object.keys(this.spinsPerDay);
    const data = Object.values(this.spinsPerDay);

    if (labels.length === 0 || data.length === 0) {
      console.warn('Aucune donnée disponible pour afficher le graphique des spins');
      return;
    }

    const spinChartConfig: ChartConfiguration<'line', number[], string> = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Spins per Day',
          data: data,
          fill: false,
          borderColor: '#0d6efd',
          tension: 0.3,
          pointBackgroundColor: '#0d6efd',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    try {
      new Chart('spinChart', spinChartConfig);
    } catch (error) {
      console.error('Erreur lors de la création du graphique des spins:', error);
    }
  }

  loadSpinHistory() {
     this.spinService.getSpinHistoriesThisWeek().subscribe({
       next: (data) => {
         this.spinHistoriesThisWeek = data;

         this.spinsPerDay = {};
         for (let entry of data) {
           const date = new Date(entry.spinHistory.spinDate).toLocaleDateString();
           this.spinsPerDay[date] = (this.spinsPerDay[date] || 0) + 1;
         }

         this.renderSpinChart();
       },
       error: (err) => {
         console.error("Erreur lors du chargement des spins de la semaine:", err);
       }
     });
   }

  exportToPDF(): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const today = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);

    doc.text('History of Weekly Tours', 14, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141); // Light gray color
    doc.text(`Generated on: ${today} at ${currentTime}`, 14, 22);



    const tableData = this.spinHistoriesThisWeek.map(entry => {
      const spinDate = new Date(entry.spinHistory.spinDate);
      const formattedDate = spinDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      let reward = entry.spinHistory.reward;
      if (!isNaN(Number(reward))) {
        reward = `$${Number(reward).toFixed(2)}`;
      }

      return [
        `${entry.userDTO.firstName} ${entry.userDTO.lastName}`,
        formattedDate,
        reward
      ];
    });

    const totalUsers = this.spinHistoriesThisWeek.length;

    let totalRewards = 0;
    let hasNumericRewards = false;

    this.spinHistoriesThisWeek.forEach(entry => {
      const rewardValue = Number(entry.spinHistory.reward);
      if (!isNaN(rewardValue)) {
        totalRewards += rewardValue;
        hasNumericRewards = true;
      }
    });

    autoTable(doc, {
      head: [['User', 'Date', 'Reward']],
      body: tableData,
      startY: 30,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255]
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50, halign: 'center' },
        2: { cellWidth: 50, halign: 'right' }
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
        lineColor: [189, 195, 199]
      },
      margin: { top: 30 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 200;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text(`Summary Information:`, 14, finalY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Participants: ${totalUsers}`, 14, finalY + 18);

    if (hasNumericRewards) {
      doc.text(`Total Rewards: $${totalRewards.toFixed(2)}`, 14, finalY + 26);
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );

      const footerText = 'Confidential - For Internal Use Only';
      doc.text(
        footerText,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: 'center' }
      );
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`weekly-tour-history-${dateStr}.pdf`);


  }
}
