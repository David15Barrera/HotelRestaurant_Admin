import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReservacionCliComponent } from './ver-reservacion-cli.component';

describe('VerReservacionCliComponent', () => {
  let component: VerReservacionCliComponent;
  let fixture: ComponentFixture<VerReservacionCliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerReservacionCliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerReservacionCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
