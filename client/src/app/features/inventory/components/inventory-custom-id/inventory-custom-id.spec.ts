import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCustomId } from './inventory-custom-id';

describe('InventoryCustomId', () => {
  let component: InventoryCustomId;
  let fixture: ComponentFixture<InventoryCustomId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryCustomId]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryCustomId);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
