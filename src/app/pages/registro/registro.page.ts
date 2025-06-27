// Proyecto/src/app/pages/registro/registro.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { AlertController, LoadingController } from '@ionic/angular'; // Importar AlertController y LoadingController

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  registerForm!: FormGroup;
  regiones: any[] = [];
  comunas: any[] = []; // Mantén esta variable para el bind del HTML si es necesario
  comunasFiltradas: any[] = []; // Esta es la que se usará para el select de comunas

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private alertController: AlertController, // Inyectar AlertController
    private loadingController: LoadingController // Inyectar LoadingController
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadLocationData(); // Carga datos de ubicación desde la API

    // Suscripción a cambios en la región para cargar comunas
    this.registerForm?.get('region')?.valueChanges.subscribe(async selectedRegionCode => {
      const comunaControl = this.registerForm.get('comuna');
      if (comunaControl) {
        if (selectedRegionCode) {
          try {
            // ¡CORRECCIÓN AQUÍ! Mapear las comunas para tener 'id' y 'nombre'
            const comunasData = await this.commonService.getComunasByRegion(selectedRegionCode);
            this.comunasFiltradas = comunasData.map((c: any) => ({ id: c.codigo, nombre: c.nombre }));
            comunaControl.enable();
          } catch (error) {
            console.error('Error al cargar comunas en valueChanges:', error);
            this.presentAlert('Error', 'No se pudieron cargar las comunas para la región seleccionada.');
            this.comunasFiltradas = [];
            comunaControl.setValue(null);
            comunaControl.disable();
          }
        } else {
          this.comunasFiltradas = [];
          comunaControl.disable();
        }
        comunaControl.setValue(null); // Resetea la comuna seleccionada al cambiar la región
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

  async loadLocationData() {
    try {
      // Mapea los datos de la API para que coincidan con la estructura esperada por el select
      const regionesData = await this.commonService.getRegions();
      this.regiones = regionesData.map((r: any) => ({ id: r.codigo, nombre: r.nombre }));
    } catch (error) {
      console.error('Error al cargar regiones:', error);
      this.presentAlert('Error', 'No se pudieron cargar las regiones.');
    }
  }

  // Este método onRegionChange es redundante si ya tienes la suscripción en ngOnInit
  // Sin embargo, si lo usas en el HTML con (ionChange)="onRegionChange()", asegúrate de que esté correcto
  // La lógica principal se maneja en el valueChanges.subscribe en ngOnInit.
  // Si lo usas aquí, debería ser:
  // onRegionChange() {
  //   const selectedRegionCode = this.registerForm.get('region')?.value;
  //   // La lógica de carga de comunas ya está en valueChanges.subscribe
  //   // Solo asegúrate de que el control de comuna se resetee si la región cambia a nulo
  //   if (!selectedRegionCode) {
  //     this.registerForm.get('comuna')?.setValue(null);
  //     this.registerForm.get('comuna')?.disable();
  //     this.comunasFiltradas = [];
  //   }
  // }


  async crearCuenta() {
    this.registerForm.markAllAsTouched();

    console.log('--- Estado del Formulario al intentar crear cuenta ---');
    console.log('Formulario válido?', this.registerForm.valid);
    console.log('Errores a nivel de FormGroup (ej. mustMatch):', this.registerForm.errors);

    Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
            console.log(`Control '${key}' es INVÁLIDO. Errores:`, control.errors);
            console.log(`Valor de '${key}':`, control.value);
        } else {
            console.log(`Control '${key}' es VÁLIDO. Valor:`, control?.value);
        }
    });
    console.log('--- Fin Depuración del Formulario ---');


    // Validaciones explícitas antes de enviar (algunas pueden ser manejadas por los validadores de FormGroup)
    if (this.registerForm.get('contrasena')?.value.length < 6) {
      this.presentAlert('Error de Contraseña', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.registerForm.get('contrasena')?.value !== this.registerForm.get('confirmarContrasena')?.value) {
      this.presentAlert('Error de Contraseña', 'Las contraseñas no coinciden.');
      return;
    }
    if (!this.registerForm.get('aceptaTerminos')?.value) {
      this.presentAlert('Términos y Condiciones', 'Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    // Asegúrate que el formato del RUT sea validado adecuadamente con un validador personalizado si es necesario
    // if (!/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]$/.test(this.registerForm.get('rut')?.value)) {
    //   this.presentAlert('RUT Inválido', 'El RUT debe seguir el formato correcto (ej. 12.345.678-9).');
    //   return;
    // }

    if (this.registerForm.invalid) {
      this.presentAlert('Formulario Inválido', 'Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.registerForm.value;

    const userData = {
      firstName: formValue.nombre,
      lastName: formValue.apellido,
      username: formValue.nombreUsuario,
      rut: formValue.rut,
      email: formValue.correo,
      regionId: formValue.region, // Envía el CÓDIGO de la región
      comunaId: formValue.comuna, // Envía el CÓDIGO de la comuna
      password: formValue.contrasena,
      // No veo un campo 'userRole' en tu formulario, si lo necesitas, asegúrate de agregarlo aquí
      // userRole: 'cliente' // Por ejemplo, un rol por defecto
    };

    console.log('--- Enviando datos de registro a la API ---');
    console.log('Payload a enviar:', userData); // NUEVO LOG CRÍTICO para ver el objeto antes de enviar

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      duration: 0 // Duración infinita hasta que se llame a dismiss
    });
    await loading.present();

    this.authService.register(userData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        console.log('Respuesta del registro:', res);
        await this.presentAlert('¡Cuenta Creada!', 'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.');
        this.router.navigateByUrl('/inicio'); // Redirigir al login o a otra página
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error en el registro:', err);
        let errorMessage = 'Ocurrió un error inesperado al crear la cuenta.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        await this.presentAlert('Error de Registro', `Error: ${errorMessage}`);
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/inicio');
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  verTerminos() {
    console.log('Clic en "Términos y Condiciones" (Modo Diseño)');
    // Aquí puedes abrir una modal, navegar a una página de términos, etc.
  }
}