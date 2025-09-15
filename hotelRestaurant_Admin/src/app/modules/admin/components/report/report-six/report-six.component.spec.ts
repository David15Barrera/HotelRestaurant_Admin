import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSixComponent } from './report-six.component';

describe('ReportSixComponent', () => {
  let component: ReportSixComponent;
  let fixture: ComponentFixture<ReportSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
