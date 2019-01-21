import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideLinesComponent } from './guide-lines.component';

describe('GuideLinesComponent', () => {
  let component: GuideLinesComponent;
  let fixture: ComponentFixture<GuideLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
