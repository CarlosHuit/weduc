import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersMenuComponent } from './letters-menu.component';

describe('LettersMenuComponent', () => {
  let component: LettersMenuComponent;
  let fixture: ComponentFixture<LettersMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LettersMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
