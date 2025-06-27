import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service'; // Importa CommonService
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false,
})
export class EditarPerfilPage implements OnInit {
  profileForm!: FormGroup;
  regiones: any[] = [];
  comunas: any[] = [];
  comunasFiltradas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private commonService: CommonService // Inyecta CommonService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadLocationData();
    this.loadUserProfile();

    // Suscribirse a los cambios de la región para actualizar las comunas filtradas
    this.profileForm.get('regionId')?.valueChanges.subscribe(async selectedRegionCode => {
      this.filterComunas(selectedRegionCode);
    });
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', Validators.required],
      regionId: [null, Validators.required],
      comunaId: [{ value: null, disabled: true }, Validators.required],
      newPassword: [''],
      confirmPassword: ['']
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== '' && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else if (newPassword && confirmPassword && newPassword.value === confirmPassword.value && confirmPassword.hasError('mustMatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  };

  // Carga las regiones y comunas desde la API
  async loadLocationData() {
    try {
      const fetchedRegiones = await this.commonService.getRegions();
      this.regiones = fetchedRegiones.map(r => ({ id: r.codigo, nombre: r.nombre }));

      // Cargar todas las comunas (aunque solo se usen filtradas) si es necesario para alguna lógica,
      // o directamente depender de `filterComunas` para cargarlas según la región seleccionada.
      // Aquí, la estrategia será cargar las comunas solo cuando se selecciona una región.
    } catch (error) {
      console.error('Error al cargar datos de ubicación:', error);
      alert('No se pudieron cargar las regiones.');
    }
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: async (data) => {
        const mappedData = {
          firstName: data.first_name,
          lastName: data.last_name,
          username: data.username,
          email: data.email,
          rut: data.rut,
          regionId: data.region_id, // Usar el código de la región de la API
          comunaId: data.comuna_id // Usar el código de la comuna de la API
        };
        this.profileForm.patchValue(mappedData);

        if (mappedData.regionId) {
          // Filtra y carga las comunas correspondientes a la región del usuario desde la API
          await this.filterComunas(mappedData.regionId);
          this.profileForm.get('comunaId')?.setValue(mappedData.comunaId);
        }
      },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        alert('No se pudo cargar la información del perfil.');
        this.router.navigateByUrl('/inicio');
      }
    });
  }

  async filterComunas(regionCode: string) { // Cambiado a async y espera código de región
    const comunaControl = this.profileForm.get('comunaId');
    if (comunaControl) {
      if (regionCode) {
        try {
          const fetchedComunas = await this.commonService.getComunasByRegion(regionCode);
          this.comunasFiltradas = fetchedComunas.map(c => ({ id: c.codigo, nombre: c.nombre }));
          comunaControl.enable();
        } catch (error) {
          console.error('Error al cargar comunas por región:', error);
          this.comunasFiltradas = [];
          comunaControl.disable();
          alert('No se pudieron cargar las comunas para la región seleccionada.');
        }
      } else {
        this.comunasFiltradas = [];
        comunaControl.disable();
      }
      comunaControl.setValue(null);
    }
  }

  updateProfile() {
    const newPasswordControl = this.profileForm.get('newPassword');
    const confirmPasswordControl = this.profileForm.get('confirmPassword');

    if (newPasswordControl && newPasswordControl.value) {
      newPasswordControl.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      newPasswordControl?.setValidators(null);
      confirmPasswordControl?.setValidators(null);
      newPasswordControl?.setValue('');
      confirmPasswordControl?.setValue('');
    }

    newPasswordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
    this.profileForm.updateValueAndValidity();

    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      alert('Por favor, completa todos los campos requeridos correctamente y asegúrate que las contraseñas coincidan y tengan el largo mínimo.');
      return;
    }

    const userData = this.profileForm.value;
    const dataToSend: any = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      rut: userData.rut,
      regionId: userData.regionId, // Envía el código de la región
      comunaId: userData.comunaId, // Envía el código de la comuna
    };

    if (userData.newPassword) {
      dataToSend.newPassword = userData.newPassword;
    }

    this.authService.updateProfile(dataToSend).subscribe({
      next: (res) => {
        alert('Perfil actualizado exitosamente!');
        console.log('Perfil actualizado:', res);
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...userData }));
        }
        newPasswordControl?.setValue('');
        confirmPasswordControl?.setValue('');
        newPasswordControl?.setErrors(null);
        confirmPasswordControl?.setErrors(null);
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        const errorMessage = err.error && err.error.message ? err.error.message : 'Ocurrió un error inesperado al actualizar el perfil.';
        alert(`Error: ${errorMessage}`);
      }
    });
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/inicio');
          },
        },
      ],
    });
    await alert.present();
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Eliminar Cuenta',
      message: '¿Estás seguro de que quieres eliminar tu cuenta de forma permanente? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteAccount();
          },
        },
      ],
    });
    await alert.present();
  }

  deleteAccount() {
    this.authService.deleteAccount().subscribe({
      next: () => {
        alert('Tu cuenta ha sido eliminada permanentemente.');
        this.authService.logout();
        this.router.navigateByUrl('/inicio');
      },
      error: (err) => {
        console.error('Error al eliminar la cuenta:', err);
        alert('Hubo un error al intentar eliminar tu cuenta.');
      },
    });
  }
}