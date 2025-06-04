import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaxiStateService {

  private taxiUpdatedSource = new Subject<any>();
  taxiUpdated$ = this.taxiUpdatedSource.asObservable();

  notifyTaxiUpdate(updatedTaxi: any) {
    this.taxiUpdatedSource.next(updatedTaxi);
  }
}
