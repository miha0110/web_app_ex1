import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Kinvey } from 'kinvey-angular2-sdk';

import { AppModule } from './app/app.module';

const config: Kinvey.ClientConfig = {
  appKey: '111111',//key
 appSecret: '11111111111'//secret

};

Kinvey.initialize(config)
  .then(() => {
    enableProdMode();
    platformBrowserDynamic().bootstrapModule(AppModule);
  });


