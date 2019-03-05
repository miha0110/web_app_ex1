import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistinfoComponent } from './distinfo.component';

describe('DistinfoComponent', () => {
  let component: DistinfoComponent;
  let fixture: ComponentFixture<DistinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
