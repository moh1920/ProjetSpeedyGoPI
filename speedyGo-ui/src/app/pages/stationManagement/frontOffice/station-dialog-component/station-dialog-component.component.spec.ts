import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDialogComponentComponent } from './station-dialog-component.component';

describe('StationDialogComponentComponent', () => {
  let component: StationDialogComponentComponent;
  let fixture: ComponentFixture<StationDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
