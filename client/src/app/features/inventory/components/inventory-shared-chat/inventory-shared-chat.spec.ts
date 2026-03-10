import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySharedChat } from './inventory-shared-chat';

describe('InventorySharedChat', () => {
  let component: InventorySharedChat;
  let fixture: ComponentFixture<InventorySharedChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySharedChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySharedChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
