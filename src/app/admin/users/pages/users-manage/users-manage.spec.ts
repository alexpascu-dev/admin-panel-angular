import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersManage } from './users-manage';

describe('UsersManage', () => {
  let component: UsersManage;
  let fixture: ComponentFixture<UsersManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersManage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersManage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
