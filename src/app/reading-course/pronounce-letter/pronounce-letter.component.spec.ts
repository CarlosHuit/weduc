import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PronounceLetterComponent } from './pronounce-letter.component';

describe('PronounceLetterComponent', () => {
  let component: PronounceLetterComponent;
  let fixture: ComponentFixture<PronounceLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PronounceLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PronounceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
