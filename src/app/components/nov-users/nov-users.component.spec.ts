import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovUsersComponent } from './nov-users.component';

describe('NovUsersComponent', () => {
  let component: NovUsersComponent;
  let fixture: ComponentFixture<NovUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
