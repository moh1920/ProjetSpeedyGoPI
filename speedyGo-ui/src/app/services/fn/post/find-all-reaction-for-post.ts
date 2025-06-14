/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageResponseReaction } from '../../models/page-response-reaction';

export interface FindAllReactionForPost$Params {
  page?: number;
  size?: number;
  postId: number;
}

export function findAllReactionForPost(http: HttpClient, rootUrl: string, params: FindAllReactionForPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseReaction>> {
  const rb = new RequestBuilder(rootUrl, findAllReactionForPost.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
    rb.path('postId', params.postId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageResponseReaction>;
    })
  );
}

findAllReactionForPost.PATH = '/posts/findAllReactionForPost/{postId}';
