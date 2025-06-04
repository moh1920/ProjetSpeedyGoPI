import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleResponseComponent } from './role-response.component';

describe('RoleResponseComponent', () => {
  let component: RoleResponseComponent;
  let fixture: ComponentFixture<RoleResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
