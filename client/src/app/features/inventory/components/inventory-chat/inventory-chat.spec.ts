import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryChat } from './inventory-chat';

describe('InventoryChat', () => {
  let component: InventoryChat;
  let fixture: ComponentFixture<InventoryChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
