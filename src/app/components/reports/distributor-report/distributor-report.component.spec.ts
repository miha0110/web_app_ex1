import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorReportComponent } from './distributor-report.component';

describe('DistributorReportComponent', () => {
  let component: DistributorReportComponent;
  let fixture: ComponentFixture<DistributorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
