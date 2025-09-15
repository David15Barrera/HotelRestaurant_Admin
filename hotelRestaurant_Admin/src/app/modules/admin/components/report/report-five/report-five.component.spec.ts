import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFiveComponent } from './report-five.component';

describe('ReportFiveComponent', () => {
  let component: ReportFiveComponent;
  let fixture: ComponentFixture<ReportFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
