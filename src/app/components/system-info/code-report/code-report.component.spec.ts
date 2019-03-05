import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeReportComponent } from './code-report.component';

describe('CodeReportComponent', () => {
  let component: CodeReportComponent;
  let fixture: ComponentFixture<CodeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
