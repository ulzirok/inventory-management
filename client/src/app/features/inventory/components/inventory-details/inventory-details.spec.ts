import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetails } from './inventory-details';

describe('InventoryDetails', () => {
  let component: InventoryDetails;
  let fixture: ComponentFixture<InventoryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
