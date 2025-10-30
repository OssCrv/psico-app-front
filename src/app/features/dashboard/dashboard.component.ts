import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { BuildingService } from '../../core/services/building.service';
import { FacilityService } from '../../core/services/facility.service';
import { ReservationService } from '../../core/services/reservation.service';
import { TherapistService } from '../../core/services/therapist.service';

interface SummaryItem {
  label: string;
  value: number;
  description: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly buildingService = inject(BuildingService);
  private readonly facilityService = inject(FacilityService);
  private readonly therapistService = inject(TherapistService);
  private readonly reservationService = inject(ReservationService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly summary = signal<SummaryItem[]>([]);

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      buildings: this.buildingService.list(),
      facilities: this.facilityService.list(),
      therapists: this.therapistService.list(),
      reservations: this.reservationService.list()
    }).subscribe({
      next: ({ buildings, facilities, therapists, reservations }) => {
        this.summary.set([
          {
            label: 'Edificios',
            value: buildings.length,
            description: 'Espacios disponibles para ofrecer servicios.',
            link: '/buildings'
          },
          {
            label: 'Consultorios',
            value: facilities.length,
            description: 'Ambientes asignables a terapeutas.',
            link: '/facilities'
          },
          {
            label: 'Terapeutas',
            value: therapists.length,
            description: 'Profesionales disponibles para reservas.',
            link: '/therapists'
          },
          {
            label: 'Reservas activas',
            value: reservations.length,
            description: 'Turnos planificados para pacientes.',
            link: '/reservations'
          }
        ]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard summary failed', err);
        this.error.set('No fue posible cargar los datos del resumen.');
        this.loading.set(false);
      }
    });
  }
}
