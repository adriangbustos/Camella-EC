import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPostulacionComponent } from './confirmacion-postulacion.component';

describe('ConfirmacionPostulacionComponent', () => {
  let component: ConfirmacionPostulacionComponent;
  let fixture: ComponentFixture<ConfirmacionPostulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionPostulacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionPostulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
