import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDeliveriesComponent } from './client-deliveries.component';

describe('ClientDeliveriesComponent', () => {
  let component: ClientDeliveriesComponent;
  let fixture: ComponentFixture<ClientDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDeliveriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
