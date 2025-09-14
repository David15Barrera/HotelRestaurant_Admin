import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioEmpAdminComponent } from './inicio-emp-admin.component';

describe('InicioEmpAdminComponent', () => {
  let component: InicioEmpAdminComponent;
  let fixture: ComponentFixture<InicioEmpAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioEmpAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioEmpAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
