import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'searchVehicle'
})
export class SearchVehiclePipe implements PipeTransform {

  transform(rentals: any[], searchText: string): any[] {
    if (!rentals || !searchText) return rentals;

    const lowerText = searchText.toLowerCase();
    return rentals.filter(rental =>
      rental.models?.toLowerCase().includes(lowerText) ||
      rental.status?.toLowerCase().includes(lowerText) ||
      rental.station?.name?.toLowerCase().includes(lowerText) ||
      rental.typeVehicleRental?.toLowerCase().includes(lowerText)
    );
  }

}
