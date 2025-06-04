import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'searchRental'
})
export class SearchRentalPipe implements PipeTransform {

  transform(rentals: any[], searchText: string): any[] {
    if (!rentals || !searchText) return rentals;

    const lowerSearch = searchText.toLowerCase();

    return rentals.filter(r =>
      r.startingPointName?.toLowerCase().includes(lowerSearch) ||
      r.destinationName?.toLowerCase().includes(lowerSearch) ||
      r.customerName?.toLowerCase().includes(lowerSearch) ||
      r.customerEmail?.toLowerCase().includes(lowerSearch) ||
      r.vehicleModel?.toLowerCase().includes(lowerSearch) ||
      (r.rentalStatus ? 'in progress' : 'completed').includes(lowerSearch)
    );
  }

}
