

import { Kinvey } from 'kinvey-angular2-sdk';

export class Order implements Kinvey.Entity {
    _id: string;
    ordersn:string;
    dateadded:string;

    orderstatus:string;
}
