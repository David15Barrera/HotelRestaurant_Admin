import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportThreeComponent } from './report-three.component';

describe('ReportThreeComponent', () => {
  let component: ReportThreeComponent;
  let fixture: ComponentFixture<ReportThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportThreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
