import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Therapist } from '../../core/models/therapist.model';
import { TherapistService } from '../../core/services/therapist.service';

@Component({
  selector: 'app-therapists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './therapists.component.html',
  styleUrl: './therapists.component.css'
})
export class TherapistsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly therapistService = inject(TherapistService);

  readonly therapists = signal<Therapist[]>([]);
  readonly loading = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    specialty: ['']
  });

  ngOnInit(): void {
    this.loadTherapists();
  }

  loadTherapists(): void {
    this.loading.set(true);
    this.error.set(null);

    this.therapistService.list().subscribe({
      next: (therapists) => {
        this.therapists.set(therapists);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Therapists load failed', err);
        this.error.set('No fue posible cargar los terapeutas.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.form.reset({ id: null, fullName: '', email: '', phoneNumber: '', specialty: '' });
    this.feedback.set(null);
    this.error.set(null);
  }

  edit(therapist: Therapist): void {
    this.form.setValue({
      id: therapist.id ?? null,
      fullName: therapist.fullName,
      email: therapist.email,
      phoneNumber: therapist.phoneNumber,
      specialty: therapist.specialty ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, ...therapistData } = this.form.getRawValue();
    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    const request = id
      ? this.therapistService.update({ id, ...therapistData })
      : this.therapistService.create(therapistData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set(id ? 'Terapeuta actualizado.' : 'Terapeuta creado.');
        this.resetForm();
        this.loadTherapists();
      },
      error: (err) => {
        console.error('Therapist save failed', err);
        this.error.set('No fue posible guardar el terapeuta.');
        this.loading.set(false);
      }
    });
  }

  remove(therapist: Therapist): void {
    if (!therapist.id) {
      return;
    }

    const confirmed = window.confirm(`¿Eliminar al terapeuta "${therapist.fullName}"?`);
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    this.therapistService.delete(therapist.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set('Terapeuta eliminado.');
        this.loadTherapists();
      },
      error: (err) => {
        console.error('Therapist delete failed', err);
        this.error.set('No fue posible eliminar el terapeuta.');
        this.loading.set(false);
      }
    });
  }

  trackById(_index: number, item: Therapist): number | undefined {
    return item.id;
  }
}
