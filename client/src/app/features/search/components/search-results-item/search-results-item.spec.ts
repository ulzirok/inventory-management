import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsItem } from './search-results-item';

describe('SearchResultsItem', () => {
  let component: SearchResultsItem;
  let fixture: ComponentFixture<SearchResultsItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
