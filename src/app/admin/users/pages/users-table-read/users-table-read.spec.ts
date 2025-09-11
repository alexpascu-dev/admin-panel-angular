import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableRead } from './users-table-read';

describe('UsersTableRead', () => {
  let component: UsersTableRead;
  let fixture: ComponentFixture<UsersTableRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTableRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTableRead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
