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
        this.loadExampleData(); // Cargamos los datos de ejemplo con IDs corregidos

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
          correo: ['', [Validators.required, Validators.email]],
          region: [null, Validators.required],
          comuna: [{ value: null, disabled: true }, Validators.required],
          contrasena: ['', [Validators.required, Validators.minLength(6)]],
          confirmarContrasena: ['', Validators.required],
          aceptaTerminos: [false, Validators.requiredTrue]
        }, {
          validator: this.mustMatch('contrasena', 'confirmarContrasena')
        });
      }

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
          { id: 1, regionId: 1, nombre: 'Viña del Mar' },
          { id: 2, regionId: 1, nombre: 'Valparaíso' },
          { id: 3, regionId: 1, nombre: 'Casablanca' },
          { id: 4, regionId: 2, nombre: 'Santiago' },
          { id: 5, regionId: 2, nombre: 'Providencia' },
          { id: 6, regionId: 3, nombre: 'Concepción' }
        ];
      }


      crearCuenta() {
        // Marca todos los controles como 'touched' para que Angular recalcule el estado de la validación
        this.registerForm.markAllAsTouched();

        // --- INICIO DE LA SECCIÓN DE DEPURACIÓN ---
        console.log('--- Estado del Formulario al intentar crear cuenta ---');
        console.log('Formulario válido?', this.registerForm.valid);
        console.log('Errores a nivel de FormGroup (ej. mustMatch):', this.registerForm.errors);

        // Itera sobre cada control para ver sus errores individuales
        Object.keys(this.registerForm.controls).forEach(key => {
            const control = this.registerForm.get(key);
            if (control?.invalid) {
                console.log(`Control '${key}' es INVÁLIDO. Errores:`, control.errors);
                console.log(`Valor de '${key}':`, control.value);
            } else {
                console.log(`Control '${key}' es VÁLIDO. Valor:`, control?.value);
            }
        });
        console.log('--- Fin de la Depuración ---');
        // --- FIN DE LA SECCIÓN DE DEPURACIÓN ---


        if (this.registerForm.invalid) {
          alert('Por favor, completa todos los campos requeridos correctamente.');
          return;
        }

        const formValue = this.registerForm.value;

        const userData = {
          firstName: formValue.nombre,
          lastName: formValue.apellido,
          username: formValue.nombreUsuario,
          rut: formValue.rut,
          email: formValue.correo,
          regionId: formValue.region,
          comunaId: formValue.comuna,
          password: formValue.contrasena
        };

        console.log('Enviando datos de registro a la API:', userData);

        this.authService.register(userData).subscribe({
          next: (res) => {
            console.log('Respuesta del registro:', res);
            alert('¡Cuenta creada exitosamente! Ahora serás redirigido para iniciar sesión.');
            this.router.navigateByUrl('/inicio');
          },
          error: (err) => {
            console.error('Error en el registro:', err);
            const errorMessage = err.error && err.error.message ? err.error.message : 'Ocurrió un error inesperado al crear la cuenta.';
            alert(`Error al crear la cuenta: ${errorMessage}`);
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
    