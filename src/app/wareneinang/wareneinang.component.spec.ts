import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareneinangComponent } from './wareneinang.component';

describe('WareneinangComponent', () => {
  let component: WareneinangComponent;
  let fixture: ComponentFixture<WareneinangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WareneinangComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WareneinangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
