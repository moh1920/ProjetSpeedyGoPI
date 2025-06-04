import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlllivreurComponent } from './alllivreur.component';

describe('AlllivreurComponent', () => {
  let component: AlllivreurComponent;
  let fixture: ComponentFixture<AlllivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlllivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlllivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
