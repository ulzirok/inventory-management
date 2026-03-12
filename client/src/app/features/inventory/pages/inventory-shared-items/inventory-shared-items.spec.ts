import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySharedItems } from './inventory-shared-items';

describe('InventorySharedItems', () => {
  let component: InventorySharedItems;
  let fixture: ComponentFixture<InventorySharedItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySharedItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySharedItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
