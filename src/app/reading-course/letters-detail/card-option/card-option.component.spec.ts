import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOptionComponent } from './card-option.component';

describe('CardOptionComponent', () => {
  let component: CardOptionComponent;
  let fixture: ComponentFixture<CardOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
