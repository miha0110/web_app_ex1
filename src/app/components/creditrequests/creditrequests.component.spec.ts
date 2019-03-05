import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditrequestsComponent } from './creditrequests.component';

describe('CreditrequestsComponent', () => {
  let component: CreditrequestsComponent;
  let fixture: ComponentFixture<CreditrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
