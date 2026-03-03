import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStats } from './inventory-stats';

describe('InventoryStats', () => {
  let component: InventoryStats;
  let fixture: ComponentFixture<InventoryStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
