import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRestauranteComponent } from './menu-restaurante.component';

describe('MenuRestauranteComponent', () => {
  let component: MenuRestauranteComponent;
  let fixture: ComponentFixture<MenuRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRestauranteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
