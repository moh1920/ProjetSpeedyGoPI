import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyalProgramDetailsComponent } from './loyal-program-details.component';

describe('LoyalProgramDetailsComponent', () => {
  let component: LoyalProgramDetailsComponent;
  let fixture: ComponentFixture<LoyalProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyalProgramDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyalProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
