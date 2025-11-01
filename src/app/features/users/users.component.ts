import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CreateUserRequest, User, UserRole } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

interface UserGroup {
  title: string;
  roleFallback: UserRole | undefined;
  users: () => User[];
  emptyMessage: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  readonly roles: UserRole[] = ['ADMIN', 'TERAPEUTA', 'PACIENTE', 'USUARIO'];
  readonly docTypes: string[] = ['CC', 'CE', 'TI', 'PAS'];

  readonly admins = signal<User[]>([]);
  readonly therapists = signal<User[]>([]);
  readonly activeUsers = signal<User[]>([]);
  readonly allUsers = signal<User[]>([]);

  readonly fetching = signal(false);
  readonly submitting = signal(false);
  readonly listError = signal<string | null>(null);
  readonly formError = signal<string | null>(null);
  readonly feedback = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    docType: [this.docTypes[0], Validators.required],
    document: ['', Validators.required],
    professionalCard: [false],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    isActive: [true],
    password: ['', Validators.required],
    role: [this.roles[2], Validators.required]
  });

  ngOnInit(): void {
    this.loadData();
  }

  get userGroups(): UserGroup[] {
    return [
      {
        title: 'Administradores',
        roleFallback: 'ADMIN',
        users: this.admins,
        emptyMessage: 'No hay administradores registrados.'
      },
      {
        title: 'Terapeutas',
        roleFallback: 'TERAPEUTA',
        users: this.therapists,
        emptyMessage: 'No hay terapeutas registrados.'
      },
      {
        title: 'Usuarios activos',
        roleFallback: undefined,
        users: this.activeUsers,
        emptyMessage: 'No hay usuarios activos registrados.'
      },
      {
        title: 'Todos los usuarios',
        roleFallback: undefined,
        users: this.allUsers,
        emptyMessage: 'No hay usuarios registrados.'
      }
    ];
  }

  loadData(): void {
    this.fetching.set(true);
    this.listError.set(null);

    forkJoin({
      admins: this.userService.listAdmins(),
      therapists: this.userService.listTherapists(),
      active: this.userService.listActive(),
      all: this.userService.listAll()
    }).subscribe({
      next: ({ admins, therapists, active, all }) => {
        this.admins.set(this.decorateUsers(admins, 'ADMIN'));
        this.therapists.set(this.decorateUsers(therapists, 'TERAPEUTA'));
        this.activeUsers.set(this.decorateUsers(active));
        this.allUsers.set(this.decorateUsers(all));
        this.fetching.set(false);
      },
      error: (err) => {
        console.error('Users load failed', err);
        this.listError.set('No fue posible cargar la información de usuarios.');
        this.fetching.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CreateUserRequest = this.form.getRawValue();

    this.submitting.set(true);
    this.formError.set(null);
    this.feedback.set(null);

    this.userService.create(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.feedback.set('Usuario creado correctamente.');
        this.form.reset({
          username: '',
          firstName: '',
          lastName: '',
          docType: this.docTypes[0],
          document: '',
          professionalCard: false,
          email: '',
          telephone: '',
          isActive: true,
          password: '',
          role: this.roles[2]
        });
        this.loadData();
      },
      error: (err) => {
        console.error('User creation failed', err);
        this.formError.set('No fue posible crear el usuario.');
        this.submitting.set(false);
      }
    });
  }

  displayName(user: User): string {
    const first = (user.firstName ?? '') as string;
    const last = (user.lastName ?? '') as string;
    const fallback = `${first} ${last}`.trim();
    const full = ((user.fullName as string | undefined) ?? fallback).trim();
    return full || (user.username as string) || 'Sin nombre';
  }

  displayDocument(user: User): string {
    const docType = (user.docType ?? user['documentType']) as string | undefined;
    const document = (user.document ?? user['documentNumber'] ?? user['identification']) as
      | string
      | undefined;

    if (!docType && !document) {
      return '—';
    }

    return [docType, document].filter(Boolean).join(' ');
  }

  displayEmail(user: User): string {
    return (user.email ?? user['mail'] ?? user['emailAddress']) as string | undefined ?? '—';
  }

  displayPhone(user: User): string {
    return (user.telephone ?? user['phone'] ?? user['mobile']) as string | undefined ?? '—';
  }

  displayRole(user: User, fallback?: UserRole): string {
    return (user.role as string | undefined) ?? (fallback ?? '—');
  }

  displayActive(user: User): string {
    const active = (user.isActive ?? user['active'] ?? user['enabled']) as boolean | undefined;
    if (active === undefined) {
      return '—';
    }
    return active ? 'Sí' : 'No';
  }

  trackByUser(_index: number, user: User): number | string {
    return (user.id as number | string | undefined) ?? user.username ?? user.email ?? _index;
  }

  private decorateUsers(users: User[], fallbackRole?: UserRole): User[] {
    return users.map((user) => ({
      ...user,
      role: user.role ?? fallbackRole
    }));
  }
}
