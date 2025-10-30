import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Facility } from '../../core/models/facility.model';
import { Reservation } from '../../core/models/reservation.model';
import { Therapist } from '../../core/models/therapist.model';
import { FacilityService } from '../../core/services/facility.service';
import { ReservationService } from '../../core/services/reservation.service';
import { TherapistService } from '../../core/services/therapist.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly facilityService = inject(FacilityService);
  private readonly therapistService = inject(TherapistService);

  readonly reservations = signal<Reservation[]>([]);
  readonly facilities = signal<Facility[]>([]);
  readonly therapists = signal<Therapist[]>([]);
  readonly loading = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    fkFacility: this.fb.control<number | null>(null, Validators.required),
    fkTherapist: this.fb.control<number | null>(null, Validators.required),
    reservationDate: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadLookups();
    this.loadReservations();
  }

  loadLookups(): void {
    this.facilityService.list().subscribe({
      next: (facilities) => this.facilities.set(facilities),
      error: (err) => {
        console.error('Facilities lookup failed', err);
        this.error.set('No fue posible cargar los consultorios disponibles.');
      }
    });

    this.therapistService.list().subscribe({
      next: (therapists) => this.therapists.set(therapists),
      error: (err) => {
        console.error('Therapists lookup failed', err);
        this.error.set('No fue posible cargar los terapeutas disponibles.');
      }
    });
  }

  loadReservations(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reservationService.list().subscribe({
      next: (reservations) => {
        this.reservations.set(reservations);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Reservations load failed', err);
        this.error.set('No fue posible cargar las reservas.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.form.reset({ id: null, fkFacility: null, fkTherapist: null, reservationDate: '' });
    this.feedback.set(null);
    this.error.set(null);
  }

  edit(reservation: Reservation): void {
    const apiDate = reservation.reservationDate;
    this.form.setValue({
      id: reservation.id ?? null,
      fkFacility: reservation.fkFacility ?? reservation.facilityDto?.id ?? null,
      fkTherapist: reservation.fkTherapist ?? reservation.therapistDto?.id ?? null,
      reservationDate: apiDate ? this.fromApiDate(apiDate) : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, fkFacility, fkTherapist, reservationDate } = this.form.getRawValue();
    if (!fkFacility || !fkTherapist || !reservationDate) {
      this.error.set('Completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      id: id ?? undefined,
      fkFacility,
      fkTherapist,
      reservationDate: this.toApiDate(reservationDate)
    };

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    const request = id
      ? this.reservationService.update(payload)
      : this.reservationService.create(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set(id ? 'Reserva actualizada.' : 'Reserva creada.');
        this.resetForm();
        this.loadReservations();
      },
      error: (err) => {
        console.error('Reservation save failed', err);
        this.error.set('No fue posible guardar la reserva.');
        this.loading.set(false);
      }
    });
  }

  remove(reservation: Reservation): void {
    if (!reservation.id) {
      return;
    }

    const confirmed = window.confirm('¿Eliminar la reserva seleccionada?');
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    this.reservationService.delete(reservation.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set('Reserva eliminada.');
        this.loadReservations();
      },
      error: (err) => {
        console.error('Reservation delete failed', err);
        this.error.set('No fue posible eliminar la reserva.');
        this.loading.set(false);
      }
    });
  }

  trackById(_index: number, item: Reservation): number | undefined {
    return item.id;
  }

  private toApiDate(date: string): string {
    return formatDate(date, 'dd/MM/yyyy', 'es-ES');
  }

  private fromApiDate(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}
