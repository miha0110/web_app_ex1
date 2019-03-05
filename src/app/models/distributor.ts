import { Kinvey } from 'kinvey-angular2-sdk';

export class Distributor implements Kinvey.Entity {
  _id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  isactive: string;
  datecreated: string;
  selected: boolean;
}
