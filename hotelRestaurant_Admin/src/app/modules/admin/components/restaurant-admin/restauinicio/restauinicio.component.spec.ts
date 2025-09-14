import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestauinicioComponent } from './restauinicio.component';

describe('RestauinicioComponent', () => {
  let component: RestauinicioComponent;
  let fixture: ComponentFixture<RestauinicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestauinicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestauinicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
