import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLetterMenuComponent } from './card-letter-menu.component';

describe('CardLetterMenuComponent', () => {
  let component: CardLetterMenuComponent;
  let fixture: ComponentFixture<CardLetterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLetterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLetterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
