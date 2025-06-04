import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
export interface CalculCostOfRental$Params {
  idRental: number;
}

export function calculCostOfRental(
  http: HttpClient,
  rootUrl: string,
  params: CalculCostOfRental$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<number>> {
  const rb = new RequestBuilder(rootUrl, calculCostOfRental.PATH, 'post');

  if (params) {
    rb.query('idRental', params.idRental, {}); // Ajout du paramètre
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<number> => r instanceof HttpResponse),
    map((r: HttpResponse<number>) => r as StrictHttpResponse<number>)
  );
}

calculCostOfRental.PATH = '/gestionStation/rental/calculCostOfRental';
