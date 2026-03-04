import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryExports } from './inventory-exports';

describe('InventoryExports', () => {
  let component: InventoryExports;
  let fixture: ComponentFixture<InventoryExports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryExports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryExports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
