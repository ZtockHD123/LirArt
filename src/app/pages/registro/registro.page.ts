import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadExampleData();

    this.registerForm?.get('region')?.valueChanges.subscribe(selectedRegionId => {
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
    });
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      rut: ['', Validators.required],
      correo: ['', [Validators.required, Validators.gmail]],
      region: [null, Validators.required],
      comuna: [{ value: null, disabled: true }, Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    }, {
      validator: this.mustMatch('contrasena', 'confirmarContrasena')
    });
  }

  // Función de validación para contraseñas
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
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
      { id: 103, regionId: 1, nombre: 'Quilpué' },
      { id: 201, regionId: 2, nombre: 'Santiago' },
      { id: 202, regionId: 2, nombre: 'Providencia' },
      { id: 301, regionId: 3, nombre: 'Concepción' }
    ];
  }

  crearCuenta() {
    if (this.registerForm.invalid) {
      alert('Por favor, completa todos los campos requeridos correctamente.');
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;

    const regionSeleccionada = this.regiones.find(r => r.id === formValue.region);
    const comunaSeleccionada = this.comunas.find(c => c.id === formValue.comuna);

    const userData = {
      nombreUsuario: formValue.nombreUsuario,
      rut: formValue.rut,
      correo: formValue.correo,
      region: regionSeleccionada ? regionSeleccionada.nombre : '',
      comuna: comunaSeleccionada ? comunaSeleccionada.nombre : '',
      contrasena: formValue.contrasena
    };

    console.log('Enviando datos de registro a la API:', userData);

    this.authService.register(userData).subscribe({
      // Callback para la respuesta exitosa
      next: (res) => {
        console.log('Respuesta del registro:', res);
        alert('¡Cuenta creada exitosamente! Ahora serás redirigido para iniciar sesión.');
        this.router.navigateByUrl('/inicio');
      },
      // Callback para manejar errores
      error: (err) => {
        console.error('Error en el registro:', err);
        alert(`Error al crear la cuenta: ${err.error.message || 'Ocurrió un error inesperado.'}`);
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/inicio');
  }

  verTerminos() {
    console.log('Clic en "Términos y Condiciones" (Modo Diseño)');
  }
}