import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OAuthSuccessPage } from './o-auth-success-page';

describe('OAuthSuccessPage', () => {
  let component: OAuthSuccessPage;
  let fixture: ComponentFixture<OAuthSuccessPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthSuccessPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OAuthSuccessPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
