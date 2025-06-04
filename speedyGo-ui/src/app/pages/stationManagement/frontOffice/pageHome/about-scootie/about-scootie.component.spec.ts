import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutScootieComponent } from './about-scootie.component';

describe('AboutScootieComponent', () => {
  let component: AboutScootieComponent;
  let fixture: ComponentFixture<AboutScootieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutScootieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutScootieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
