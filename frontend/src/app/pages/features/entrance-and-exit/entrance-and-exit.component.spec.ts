import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceAndExitComponent } from './entrance-and-exit.component';

describe('EntranceAndExitComponent', () => {
  let component: EntranceAndExitComponent;
  let fixture: ComponentFixture<EntranceAndExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntranceAndExitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntranceAndExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
