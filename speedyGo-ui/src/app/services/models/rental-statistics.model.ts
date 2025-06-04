export interface MonthlyTrend {
  month: string;
  average: number;
  trend: 'N/A' | 'Croissance' | 'Décroissance' | 'Stable';
}
