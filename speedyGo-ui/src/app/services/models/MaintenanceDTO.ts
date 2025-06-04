export interface MaintenanceDTO {
  id: number;
  status?: 'Pending' | 'In_progress' | 'Completed';
  scheduledDate: string;
  maintenanceType: string;
  cost: number;
  technicianName: string;
  emailTechnician: string;
  estimatedCompletionTime: string;
  vehicleRentalModels?: string;
}
