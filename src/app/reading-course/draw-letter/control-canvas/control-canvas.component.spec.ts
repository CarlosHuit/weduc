import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCanvasComponent } from './control-canvas.component';

describe('ControlCanvasComponent', () => {
  let component: ControlCanvasComponent;
  let fixture: ComponentFixture<ControlCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
