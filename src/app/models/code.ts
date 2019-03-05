import { Kinvey } from 'kinvey-angular2-sdk';

export class Code implements Kinvey.Entity {
  _id: string;
  Code: string;
  CodeType: string;
  sent: string;
  date: string;
  SystemSn: string;
  selected: boolean;
}
