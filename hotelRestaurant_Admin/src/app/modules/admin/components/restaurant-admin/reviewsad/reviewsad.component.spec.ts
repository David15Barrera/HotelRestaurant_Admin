import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsadComponent } from './reviewsad.component';

describe('ReviewsadComponent', () => {
  let component: ReviewsadComponent;
  let fixture: ComponentFixture<ReviewsadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
