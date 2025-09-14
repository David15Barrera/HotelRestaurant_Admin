import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarHabitacionesComponent } from './reservar-habitaciones.component';

describe('ReservarHabitacionesComponent', () => {
  let component: ReservarHabitacionesComponent;
  let fixture: ComponentFixture<ReservarHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarHabitacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservarHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
