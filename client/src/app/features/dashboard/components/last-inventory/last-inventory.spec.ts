import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastInventory } from './last-inventory';

describe('LastInventory', () => {
  let component: LastInventory;
  let fixture: ComponentFixture<LastInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastInventory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
