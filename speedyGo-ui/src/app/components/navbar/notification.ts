export interface Notification {
  status?:  'PAYED'|'EN_COURS'|'ANNULER' ;
  message?: string;
  orderid?: string;

}
