import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnthisdayComponent } from './onthisday.component';

describe('OnthisdayComponent', () => {
  let component: OnthisdayComponent;
  let fixture: ComponentFixture<OnthisdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnthisdayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnthisdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
