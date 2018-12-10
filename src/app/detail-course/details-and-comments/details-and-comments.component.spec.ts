import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAndCommentsComponent } from './details-and-comments.component';

describe('DetailsAndCommentsComponent', () => {
  let component: DetailsAndCommentsComponent;
  let fixture: ComponentFixture<DetailsAndCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAndCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAndCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
