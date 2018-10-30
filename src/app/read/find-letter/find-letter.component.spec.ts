import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindLetterComponent } from './find-letter.component';

describe('FindLetterComponent', () => {
  let component: FindLetterComponent;
  let fixture: ComponentFixture<FindLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
