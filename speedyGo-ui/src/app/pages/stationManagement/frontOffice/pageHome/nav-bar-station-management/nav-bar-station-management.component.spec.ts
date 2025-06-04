import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarStationManagementComponent } from './nav-bar-station-management.component';

describe('NavBarStationManagementComponent', () => {
  let component: NavBarStationManagementComponent;
  let fixture: ComponentFixture<NavBarStationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarStationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarStationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
