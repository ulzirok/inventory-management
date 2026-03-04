import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAccess } from './inventory-access';

describe('InventoryAccess', () => {
  let component: InventoryAccess;
  let fixture: ComponentFixture<InventoryAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
