import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawLetterComponent } from './draw-letter.component';

describe('DrawLetterComponent', () => {
  let component: DrawLetterComponent;
  let fixture: ComponentFixture<DrawLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
