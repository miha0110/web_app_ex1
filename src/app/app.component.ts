import { Component } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
 `
})
export class AppComponent {
  title = 'app works!';
}
