import { Kinvey } from 'kinvey-angular2-sdk';

export class Hp implements Kinvey.Entity {

  _id: string;
  serialNumber: Number;
  hpCounter: string;
  pairedWith: Number;
  

}
