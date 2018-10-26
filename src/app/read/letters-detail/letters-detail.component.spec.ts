import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersDetailComponent } from './letters-detail.component';

describe('LettersDetailComponent', () => {
  let component: LettersDetailComponent;
  let fixture: ComponentFixture<LettersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LettersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
