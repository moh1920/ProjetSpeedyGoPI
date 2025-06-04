import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterStationTemplateComponent } from './footer-station-template.component';

describe('FooterStationTemplateComponent', () => {
  let component: FooterStationTemplateComponent;
  let fixture: ComponentFixture<FooterStationTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterStationTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterStationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
