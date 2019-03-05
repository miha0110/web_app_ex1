import { Kinvey } from 'kinvey-angular2-sdk';

export class User implements Kinvey.Entity {
    _id: string;
    username: string;
    role: string;
    phone: string;
    email: string;
    lastname: string;
    firstname: string;
    Role: string;
    selected: boolean;
    isactive: string;
    datecreated: string;

}
