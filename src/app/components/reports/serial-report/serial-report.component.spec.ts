import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialReportComponent } from './serial-report.component';

describe('SerialReportComponent', () => {
  let component: SerialReportComponent;
  let fixture: ComponentFixture<SerialReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
