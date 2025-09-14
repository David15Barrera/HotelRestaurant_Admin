import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCliComponent } from './perfil-cli.component';

describe('PerfilCliComponent', () => {
  let component: PerfilCliComponent;
  let fixture: ComponentFixture<PerfilCliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilCliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
