import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterDetailModalComponent } from './letter-detail-modal.component';

describe('LetterDetailModalComponent', () => {
  let component: LetterDetailModalComponent;
  let fixture: ComponentFixture<LetterDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
