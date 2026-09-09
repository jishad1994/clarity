import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripHtml } from './strip-html';

describe('StripHtml', () => {
  let component: StripHtml;
  let fixture: ComponentFixture<StripHtml>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripHtml],
    }).compileComponents();

    fixture = TestBed.createComponent(StripHtml);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
