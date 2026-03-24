import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpForm } from './help-form';

describe('HelpForm', () => {
  let component: HelpForm;
  let fixture: ComponentFixture<HelpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
