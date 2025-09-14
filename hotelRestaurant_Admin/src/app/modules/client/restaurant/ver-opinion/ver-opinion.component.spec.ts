import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOpinionComponent } from './ver-opinion.component';

describe('VerOpinionComponent', () => {
  let component: VerOpinionComponent;
  let fixture: ComponentFixture<VerOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerOpinionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
