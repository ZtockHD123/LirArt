import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'; // Añadir para formularios reactivos
import { RouterTestingModule } from '@angular/router/testing'; // Añadir para Router

// ExploreContainerComponentModule se elimina si no es necesario
// import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { RegistroPage } from './registro.page'; // Cambiado

describe('RegistroPage', () => { // Cambiado
  let component: RegistroPage; // Cambiado
  let fixture: ComponentFixture<RegistroPage>; // Cambiado

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPage], // Cambiado
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule, // Añadido
        RouterTestingModule // Añadido
        // ExploreContainerComponentModule // Eliminado o mantener si es necesario
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage); // Cambiado
    component = fixture.componentInstance; // Cambiado
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Añade más pruebas unitarias aquí si es necesario
});
