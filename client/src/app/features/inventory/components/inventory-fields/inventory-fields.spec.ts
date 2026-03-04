import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFields } from './inventory-fields';

describe('InventoryFields', () => {
  let component: InventoryFields;
  let fixture: ComponentFixture<InventoryFields>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryFields]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryFields);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
