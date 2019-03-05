import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCreditLineComponent } from './device-credit-line.component';

describe('DeviceCreditLineComponent', () => {
  let component: DeviceCreditLineComponent;
  let fixture: ComponentFixture<DeviceCreditLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceCreditLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceCreditLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
