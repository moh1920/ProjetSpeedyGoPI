import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavForumComponent } from './nav-forum.component';

describe('NavForumComponent', () => {
  let component: NavForumComponent;
  let fixture: ComponentFixture<NavForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavForumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
