import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFourComponent } from './report-four.component';

describe('ReportFourComponent', () => {
  let component: ReportFourComponent;
  let fixture: ComponentFixture<ReportFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
