import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTemplateComponent } from './store-template.component';

describe('StoreTemplateComponent', () => {
  let component: StoreTemplateComponent;
  let fixture: ComponentFixture<StoreTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
