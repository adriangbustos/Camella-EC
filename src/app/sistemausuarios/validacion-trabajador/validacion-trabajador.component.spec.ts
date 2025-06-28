import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionTrabajadorComponent } from './validacion-trabajador.component';

describe('ValidacionTrabajadorComponent', () => {
  let component: ValidacionTrabajadorComponent;
  let fixture: ComponentFixture<ValidacionTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacionTrabajadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidacionTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
