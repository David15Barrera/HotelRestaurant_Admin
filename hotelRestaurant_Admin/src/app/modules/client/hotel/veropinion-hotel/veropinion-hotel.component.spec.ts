import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeropinionHotelComponent } from './veropinion-hotel.component';

describe('VeropinionHotelComponent', () => {
  let component: VeropinionHotelComponent;
  let fixture: ComponentFixture<VeropinionHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeropinionHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeropinionHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
