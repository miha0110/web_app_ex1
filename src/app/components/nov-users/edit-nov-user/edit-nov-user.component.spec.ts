import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNovUserComponent } from './edit-nov-user.component';

describe('EditNovUserComponent', () => {
  let component: EditNovUserComponent;
  let fixture: ComponentFixture<EditNovUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNovUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNovUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
