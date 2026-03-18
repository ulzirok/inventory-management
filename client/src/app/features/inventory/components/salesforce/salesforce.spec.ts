import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salesforce } from './salesforce';

describe('Salesforce', () => {
  let component: Salesforce;
  let fixture: ComponentFixture<Salesforce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salesforce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salesforce);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
