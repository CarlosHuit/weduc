import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWordsComponent } from './select-words.component';

describe('SelectWordsComponent', () => {
  let component: SelectWordsComponent;
  let fixture: ComponentFixture<SelectWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
