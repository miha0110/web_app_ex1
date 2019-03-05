import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorsReportComponent } from './distributors-report.component';

describe('DistributorsReportComponent', () => {
  let component: DistributorsReportComponent;
  let fixture: ComponentFixture<DistributorsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
