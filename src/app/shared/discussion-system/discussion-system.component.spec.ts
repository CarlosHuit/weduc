import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionSystemComponent } from './discussion-system.component';

describe('DiscussionSystemComponent', () => {
  let component: DiscussionSystemComponent;
  let fixture: ComponentFixture<DiscussionSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
