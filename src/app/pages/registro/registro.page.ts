import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  registerForm!: FormGroup;
  regiones: any[] = [];
  comunas: any[] = [];
  comunasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadExampleData();

    this.registerForm?.get('region')?.valueChanges.subscribe(selectedRegionId => {
      this.filterComunas(selectedRegionId);
    });
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      rut: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      region: [null, Validators.required],
      comuna: [{ value: null, disabled: true }, Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    });
  }

  loadExampleData() {
    this.regiones = [
      { id: 1, nombre: 'Valparaíso' },
      { id: 2, nombre: 'Metropolitana' },
      { id: 3, nombre: 'Biobío' }
    ];
    this.comunas = [
      { id: 101, regionId: 1, nombre: 'Viña del Mar' },
      { id: 102, regionId: 1, nombre: 'Valparaíso' },
      { id: 103, regionId: 1, nombre: 'Casablanca' },
      { id: 201, regionId: 2, nombre: 'Santiago' },
      { id: 202, regionId: 2, nombre: 'Providencia' },
      { id: 301, regionId: 3, nombre: 'Concepción' }
    ];
  }

  filterComunas(selectedRegionId: number) {
    const comunaControl = this.registerForm.get('comuna');
    if (comunaControl) {
      if (selectedRegionId) {
        this.comunasFiltradas = this.comunas.filter(c => c.regionId === Number(selectedRegionId));
        comunaControl.enable();
      } else {
        this.comunasFiltradas = [];
        comunaControl.disable();
      }
      comunaControl.setValue(null);
    }
  }

  createAccount() {
    console.log('Botón "Crear Cuenta" presionado (Modo Diseño - Sin guardar datos)');
    if (this.registerForm?.valid) {
       console.log('Formulario válido (visualmente).');
    } else {
       console.error('Formulario inválido (visualmente).');
       this.registerForm?.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/incio');
  }

  verTerminos() {
    console.log('Clic en "Términos y Condiciones" (Modo Diseño)');
  }

  crearCuenta() {
    console.log('Boton para Crear cuenta presionado - Navegando a /inicio');
    this.router.navigateByUrl('/inicio');
  }
}
