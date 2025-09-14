import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRestaurantesComponent } from './list-restaurantes.component';

describe('ListRestaurantesComponent', () => {
  let component: ListRestaurantesComponent;
  let fixture: ComponentFixture<ListRestaurantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRestaurantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRestaurantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
