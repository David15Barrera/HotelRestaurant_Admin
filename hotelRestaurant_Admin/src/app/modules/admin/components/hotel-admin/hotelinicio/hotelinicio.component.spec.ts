import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelinicioComponent } from './hotelinicio.component';

describe('HotelinicioComponent', () => {
  let component: HotelinicioComponent;
  let fixture: ComponentFixture<HotelinicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelinicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelinicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
