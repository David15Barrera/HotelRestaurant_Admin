import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHotelesComponent } from './detail-hoteles.component';

describe('DetailHotelesComponent', () => {
  let component: DetailHotelesComponent;
  let fixture: ComponentFixture<DetailHotelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailHotelesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailHotelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
