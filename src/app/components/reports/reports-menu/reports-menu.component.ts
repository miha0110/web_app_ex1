import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports-menu',
  templateUrl: './reports-menu.component.html',
  styleUrls: ['./reports-menu.component.css']
})
export class ReportsMenuComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

}
