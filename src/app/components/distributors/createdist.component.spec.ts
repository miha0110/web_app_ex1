import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedistComponent } from './createdist.component';

describe('CreatedistComponent', () => {
  let component: CreatedistComponent;
  let fixture: ComponentFixture<CreatedistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
