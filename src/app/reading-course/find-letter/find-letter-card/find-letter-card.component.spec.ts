import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindLetterCardComponent } from './find-letter-card.component';

describe('FindLetterCardComponent', () => {
  let component: FindLetterCardComponent;
  let fixture: ComponentFixture<FindLetterCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindLetterCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindLetterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
