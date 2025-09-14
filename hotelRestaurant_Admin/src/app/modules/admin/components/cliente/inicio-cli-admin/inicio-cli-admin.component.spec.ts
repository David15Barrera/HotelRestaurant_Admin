import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCliAdminComponent } from './inicio-cli-admin.component';

describe('InicioCliAdminComponent', () => {
  let component: InicioCliAdminComponent;
  let fixture: ComponentFixture<InicioCliAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioCliAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioCliAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
