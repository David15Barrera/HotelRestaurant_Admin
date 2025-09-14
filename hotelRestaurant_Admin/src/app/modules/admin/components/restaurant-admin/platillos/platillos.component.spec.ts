import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatillosComponent } from './platillos.component';

describe('PlatillosComponent', () => {
  let component: PlatillosComponent;
  let fixture: ComponentFixture<PlatillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatillosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
