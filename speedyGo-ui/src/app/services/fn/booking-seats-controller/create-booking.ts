/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BookingSeats } from '../../models/booking-seats';

export interface CreateBooking$Params {
  carpoolingId: number;
  seatsRequested: number;
}

export function createBooking(http: HttpClient, rootUrl: string, params: CreateBooking$Params, context?: HttpContext): Observable<StrictHttpResponse<BookingSeats>> {
  const rb = new RequestBuilder(rootUrl, createBooking.PATH, 'post');
  if (params) {
    rb.query('carpoolingId', params.carpoolingId, {});
    rb.query('seatsRequested', params.seatsRequested, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BookingSeats>;
    })
  );
}

createBooking.PATH = '/bookingSeats/create';
