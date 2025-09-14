import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsHotComponent } from './reviews-hot.component';

describe('ReviewsHotComponent', () => {
  let component: ReviewsHotComponent;
  let fixture: ComponentFixture<ReviewsHotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsHotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsHotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
