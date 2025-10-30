import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Building } from '../../core/models/building.model';
import { Facility } from '../../core/models/facility.model';
import { BuildingService } from '../../core/services/building.service';
import { FacilityService } from '../../core/services/facility.service';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.css'
})
export class FacilitiesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly facilityService = inject(FacilityService);
  private readonly buildingService = inject(BuildingService);

  readonly facilities = signal<Facility[]>([]);
  readonly buildings = signal<Building[]>([]);
  readonly loading = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    fkBuilding: this.fb.control<number | null>(null, Validators.required),
    roomNumber: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadBuildings();
    this.loadFacilities();
  }

  loadBuildings(): void {
    this.buildingService.list().subscribe({
      next: (buildings) => this.buildings.set(buildings),
      error: (err) => {
        console.error('Buildings lookup failed', err);
        this.error.set('No fue posible cargar los edificios disponibles.');
      }
    });
  }

  loadFacilities(): void {
    this.loading.set(true);
    this.error.set(null);

    this.facilityService.list().subscribe({
      next: (facilities) => {
        this.facilities.set(facilities);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Facilities load failed', err);
        this.error.set('No fue posible cargar los consultorios.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.form.reset({ id: null, fkBuilding: null, roomNumber: '' });
    this.feedback.set(null);
    this.error.set(null);
  }

  edit(facility: Facility): void {
    this.form.setValue({
      id: facility.id ?? null,
      fkBuilding: facility.fkBuilding ?? facility.buildingDto?.id ?? null,
      roomNumber: facility.roomNumber
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, fkBuilding, roomNumber } = this.form.getRawValue();
    if (!fkBuilding) {
      this.error.set('Selecciona un edificio válido.');
      return;
    }

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    const payload = { id: id ?? undefined, fkBuilding, roomNumber };
    const request = id
      ? this.facilityService.update(payload)
      : this.facilityService.create(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set(id ? 'Consultorio actualizado.' : 'Consultorio creado.');
        this.resetForm();
        this.loadFacilities();
      },
      error: (err) => {
        console.error('Facility save failed', err);
        this.error.set('No fue posible guardar el consultorio.');
        this.loading.set(false);
      }
    });
  }

  remove(facility: Facility): void {
    if (!facility.id) {
      return;
    }

    const confirmed = window.confirm(`¿Eliminar el consultorio "${facility.roomNumber}"?`);
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    this.facilityService.delete(facility.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set('Consultorio eliminado.');
        this.loadFacilities();
      },
      error: (err) => {
        console.error('Facility delete failed', err);
        this.error.set('No fue posible eliminar el consultorio.');
        this.loading.set(false);
      }
    });
  }

  trackById(_index: number, item: Facility): number | undefined {
    return item.id;
  }
}
