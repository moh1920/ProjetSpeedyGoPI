import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'searchMaintenance'
})
export class SearchMaintenancePipe implements PipeTransform {

  transform(maintenances: any[], searchText: string): any[] {
    if (!maintenances || !searchText) return maintenances;

    const lowerSearch = searchText.toLowerCase();

    return maintenances.filter(m =>
      m.maintenanceType?.toLowerCase().includes(lowerSearch) ||
      m.technicianName?.toLowerCase().includes(lowerSearch) ||
      m.emailTechnician?.toLowerCase().includes(lowerSearch) ||
      m.status?.toLowerCase().includes(lowerSearch) ||
      m.scheduledDate?.toString().toLowerCase().includes(lowerSearch)
    );
  }

}
