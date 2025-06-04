import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'searchStation'
})
export class SearchStationPipe implements PipeTransform {

  transform(stations: any[], searchText: string): any[] {
    if (!stations || !searchText) return stations;

    const lowerSearch = searchText.toLowerCase();

    return stations.filter(station =>
      station.name?.toLowerCase().includes(lowerSearch) ||
      station.location?.toLowerCase().includes(lowerSearch) ||
      (station.is_active ? 'active' : 'inactive').includes(lowerSearch)
    );
  }

}
