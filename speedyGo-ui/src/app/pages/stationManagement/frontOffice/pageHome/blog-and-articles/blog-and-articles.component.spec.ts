import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogAndArticlesComponent } from './blog-and-articles.component';

describe('BlogAndArticlesComponent', () => {
  let component: BlogAndArticlesComponent;
  let fixture: ComponentFixture<BlogAndArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogAndArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogAndArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
