import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItems } from './dashboard-items';

describe('DashboardItems', () => {
  let component: DashboardItems;
  let fixture: ComponentFixture<DashboardItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
