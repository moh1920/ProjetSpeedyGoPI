/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { Transaction } from '../models/transaction';
export interface Payment {
  amount?: number;
  createdTimestamp?: number;
  currency?: string;
  id?: number;
  paymentIntentId?: string;
  status?: string;
  transactions?: Array<Transaction>;
  userEmail?: string;
}
