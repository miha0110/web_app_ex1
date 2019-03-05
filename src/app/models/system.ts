import { Kinvey } from 'kinvey-angular2-sdk';

export class System implements Kinvey.Entity {
  _id: string;
  distid: string;
  serialNumber: Number;
  isdnum: string;
  creditpulse: string;
  hppulse: string;
  fwv: string;
  isactive: string;
  distributor: string;
  datecreated: string;
  selected: boolean;
  hppulseright: string;
  userHistory: string[]
  hpSerialNumber:string;
  manCode:string;
  lastupdate:string;

}
