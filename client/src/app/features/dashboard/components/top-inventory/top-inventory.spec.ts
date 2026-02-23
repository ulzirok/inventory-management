import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopInventory } from './top-inventory';

describe('TopInventory', () => {
  let component: TopInventory;
  let fixture: ComponentFixture<TopInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopInventory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
