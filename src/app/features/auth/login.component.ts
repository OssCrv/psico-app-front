import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService, UserRole } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectByRole(this.authService.getRole());
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.authenticate(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.redirectByRole(this.authService.getRole());
      },
      error: (err) => {
        console.error('Authentication failed', err);
        this.loading.set(false);
        this.error.set('No se pudo iniciar sesión. Revisa tus credenciales o intenta más tarde.');
      }
    });
  }

  private redirectByRole(role: UserRole | null): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'TERAPEUTA':
        this.router.navigate(['/therapist']);
        break;
      case 'PACIENTE':
        this.router.navigate(['/patient']);
        break;
      case 'USUARIO':
        this.router.navigate(['/user']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
