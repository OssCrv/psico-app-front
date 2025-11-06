import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

import {
  BaseRegistrationPayload,
  RegistrationRole,
  RegistrationService
} from '../../../core/services/registration.service';

interface RoleConfig {
  role: RegistrationRole;
  title: string;
  description: string;
  buttonLabel: string;
  accentIcon: string;
}

const ROLE_CONFIG: Record<RegistrationRole, RoleConfig> = {
  therapist: {
    role: 'therapist',
    title: 'Registra tu cuenta de terapeuta',
    description:
      'Cuéntanos tus datos profesionales para que los pacientes puedan encontrarte y reservar citas.',
    buttonLabel: 'Registrarme como terapeuta',
    accentIcon: 'psychology_alt'
  },
  user: {
    role: 'user',
    title: 'Crea tu cuenta de gestor de edificios',
    description:
      'Administra espacios, horarios y disponibilidad para que los terapeutas puedan trabajar contigo.',
    buttonLabel: 'Registrarme como gestor',
    accentIcon: 'domain_add'
  },
  patient: {
    role: 'patient',
    title: 'Únete como paciente',
    description:
      'Reserva sesiones con terapeutas en los edificios disponibles y lleva el seguimiento de tus citas.',
    buttonLabel: 'Registrarme como paciente',
    accentIcon: 'groups'
  }
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly registrationService = inject(RegistrationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  readonly docTypes = ['CC', 'CE', 'TI', 'PAS'];

  readonly currentRole = signal<RegistrationRole>('patient');
  readonly loading = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly config = computed(() => ROLE_CONFIG[this.currentRole()]);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    docType: [this.docTypes[0], Validators.required],
    document: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    professionalCard: [false],
    specialty: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    this.form.addValidators((control) => this.passwordMatchValidator(control));
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => this.handleParams(params));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get showProfessionalCard(): boolean {
    return this.currentRole() === 'therapist';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      username,
      firstName,
      lastName,
      docType,
      document,
      email,
      telephone,
      professionalCard,
      specialty,
      password
    } = this.form.getRawValue();

    const fullName = `${firstName} ${lastName}`.trim();
    const role = this.currentRole();
    const roleCode: BaseRegistrationPayload['role'] =
      role === 'therapist' ? 'TERAPEUTA' : role === 'user' ? 'USUARIO' : 'PACIENTE';
    const basePayload: BaseRegistrationPayload = {
      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      docType,
      document: document.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      phoneNumber: telephone.trim(),
      password,
      role: roleCode
    };

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    let request$: Observable<unknown>;

    switch (role) {
      case 'therapist':
        request$ = this.registrationService.registerTherapist({
          ...basePayload,
          professionalCard,
          specialty: specialty?.trim() || undefined
        });
        break;
      case 'user':
        request$ = this.registrationService.registerUser(basePayload);
        break;
      case 'patient':
      default:
        request$ = this.registrationService.registerPatient(basePayload);
        break;
    }

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set('¡Registro completado! Ya puedes iniciar sesión con tus credenciales.');
        this.form.reset({
          username: '',
          firstName: '',
          lastName: '',
          docType: this.docTypes[0],
          document: '',
          email: '',
          telephone: '',
          professionalCard: false,
          specialty: '',
          password: '',
          confirmPassword: ''
        });
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.loading.set(false);
        this.error.set('No fue posible completar el registro. Intenta de nuevo más tarde.');
      }
    });
  }

  navigateToSelection(): void {
    this.router.navigate(['/register']);
  }

  private handleParams(params: Params): void {
    const role = params['role'];
    if (!role || !['therapist', 'user', 'patient'].includes(role)) {
      this.router.navigate(['/register']);
      return;
    }

    this.currentRole.set(role as RegistrationRole);
    this.form.get('professionalCard')?.setValue(false);
    this.form.get('specialty')?.setValue('');
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value as string | null;
    const confirm = control.get('confirmPassword')?.value as string | null;

    if (!password || !confirm) {
      return null;
    }

    return password === confirm ? null : { passwordMismatch: true };
  }

  get passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch');
  }
}
