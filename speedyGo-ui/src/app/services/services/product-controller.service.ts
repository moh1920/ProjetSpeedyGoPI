/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addProduct } from '../fn/product-controller/add-product';
import { AddProduct$Params } from '../fn/product-controller/add-product';
import { deleteProduct } from '../fn/product-controller/delete-product';
import { DeleteProduct$Params } from '../fn/product-controller/delete-product';
import { getAllProducts } from '../fn/product-controller/get-all-products';
import { GetAllProducts$Params } from '../fn/product-controller/get-all-products';
import { getProductById } from '../fn/product-controller/get-product-by-id';
import { GetProductById$Params } from '../fn/product-controller/get-product-by-id';
import { getProductByName } from '../fn/product-controller/get-product-by-name';
import { GetProductByName$Params } from '../fn/product-controller/get-product-by-name';
import { getProductDescription } from '../fn/product-controller/get-product-description';
import { GetProductDescription$Params } from '../fn/product-controller/get-product-description';
import { getProductPrice } from '../fn/product-controller/get-product-price';
import { GetProductPrice$Params } from '../fn/product-controller/get-product-price';
import { getProductStock } from '../fn/product-controller/get-product-stock';
import { GetProductStock$Params } from '../fn/product-controller/get-product-stock';
import { PageResponseProductResponse } from '../models/page-response-product-response';
import { Product } from '../models/product';
import { updateProduct } from '../fn/product-controller/update-product';
import { UpdateProduct$Params } from '../fn/product-controller/update-product';

@Injectable({ providedIn: 'root' })
export class ProductControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getProductById()` */
  static readonly GetProductByIdPath = '/product/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProductById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductById$Response(params: GetProductById$Params, context?: HttpContext): Observable<StrictHttpResponse<Product>> {
    return getProductById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProductById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductById(params: GetProductById$Params, context?: HttpContext): Observable<Product> {
    return this.getProductById$Response(params, context).pipe(
      map((r: StrictHttpResponse<Product>): Product => r.body)
    );
  }

  /** Path part for operation `updateProduct()` */
  static readonly UpdateProductPath = '/product/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateProduct()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProduct$Response(params: UpdateProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<Product>> {
    return updateProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateProduct$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProduct(params: UpdateProduct$Params, context?: HttpContext): Observable<Product> {
    return this.updateProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<Product>): Product => r.body)
    );
  }

  /** Path part for operation `deleteProduct()` */
  static readonly DeleteProductPath = '/product/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProduct()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProduct$Response(params: DeleteProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteProduct$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProduct(params: DeleteProduct$Params, context?: HttpContext): Observable<void> {
    return this.deleteProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getAllProducts()` */
  static readonly GetAllProductsPath = '/product';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllProducts()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllProducts$Response(params: GetAllProducts$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseProductResponse>> {
    return getAllProducts(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllProducts$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllProducts(params: GetAllProducts$Params, context?: HttpContext): Observable<PageResponseProductResponse> {
    return this.getAllProducts$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseProductResponse>): PageResponseProductResponse => r.body)
    );
  }

  /** Path part for operation `addProduct()` */
  static readonly AddProductPath = '/product';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addProduct()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  addProduct$Response(params: AddProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<Product>> {
    return addProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addProduct$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  addProduct(params: AddProduct$Params, context?: HttpContext): Observable<Product> {
    return this.addProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<Product>): Product => r.body)
    );
  }

  /** Path part for operation `getProductStock()` */
  static readonly GetProductStockPath = '/product/stock/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProductStock()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductStock$Response(params: GetProductStock$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return getProductStock(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProductStock$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductStock(params: GetProductStock$Params, context?: HttpContext): Observable<number> {
    return this.getProductStock$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getProductPrice()` */
  static readonly GetProductPricePath = '/product/price/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProductPrice()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductPrice$Response(params: GetProductPrice$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return getProductPrice(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProductPrice$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductPrice(params: GetProductPrice$Params, context?: HttpContext): Observable<number> {
    return this.getProductPrice$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `getProductByName()` */
  static readonly GetProductByNamePath = '/product/name/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProductByName()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductByName$Response(params: GetProductByName$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return getProductByName(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProductByName$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductByName(params: GetProductByName$Params, context?: HttpContext): Observable<string> {
    return this.getProductByName$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `getProductDescription()` */
  static readonly GetProductDescriptionPath = '/product/description/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProductDescription()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductDescription$Response(params: GetProductDescription$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return getProductDescription(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProductDescription$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductDescription(params: GetProductDescription$Params, context?: HttpContext): Observable<string> {
    return this.getProductDescription$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  getProductsByOwner(): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:8020/product/getProductByOwner`);
  }

}
