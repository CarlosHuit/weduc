import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsUserDialogComponent } from './icons-user-dialog.component';

describe('IconsUserDialogComponent', () => {
  let component: IconsUserDialogComponent;
  let fixture: ComponentFixture<IconsUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconsUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
