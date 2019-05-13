import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnedLettersComponent } from './learned-letters.component';

describe('LearnedLettersComponent', () => {
  let component: LearnedLettersComponent;
  let fixture: ComponentFixture<LearnedLettersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnedLettersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnedLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
