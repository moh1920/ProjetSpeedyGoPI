import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileForumComponent } from './my-profile-forum.component';

describe('MyProfileForumComponent', () => {
  let component: MyProfileForumComponent;
  let fixture: ComponentFixture<MyProfileForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileForumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
