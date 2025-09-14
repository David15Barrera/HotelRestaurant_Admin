import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdensDetailComponent } from './ordens-detail.component';

describe('OrdensDetailComponent', () => {
  let component: OrdensDetailComponent;
  let fixture: ComponentFixture<OrdensDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdensDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdensDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
