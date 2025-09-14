import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionHotelComponent } from './opinion-hotel.component';

describe('OpinionHotelComponent', () => {
  let component: OpinionHotelComponent;
  let fixture: ComponentFixture<OpinionHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
