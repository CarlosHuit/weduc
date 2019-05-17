import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHandwritingComponent } from './modal-handwriting.component';

describe('ModalHandwritingComponent', () => {
  let component: ModalHandwritingComponent;
  let fixture: ComponentFixture<ModalHandwritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHandwritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHandwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
