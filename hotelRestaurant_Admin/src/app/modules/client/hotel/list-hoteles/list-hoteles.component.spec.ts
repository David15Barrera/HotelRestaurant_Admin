import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHotelesComponent } from './list-hoteles.component';

describe('ListHotelesComponent', () => {
  let component: ListHotelesComponent;
  let fixture: ComponentFixture<ListHotelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHotelesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHotelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
