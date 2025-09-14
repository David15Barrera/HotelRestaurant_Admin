import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionCuartoComponent } from './opinion-cuarto.component';

describe('OpinionCuartoComponent', () => {
  let component: OpinionCuartoComponent;
  let fixture: ComponentFixture<OpinionCuartoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionCuartoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionCuartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
