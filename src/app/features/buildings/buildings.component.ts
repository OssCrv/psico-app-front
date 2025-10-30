import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Building } from '../../core/models/building.model';
import { BuildingService } from '../../core/services/building.service';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.css'
})
export class BuildingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly buildingService = inject(BuildingService);

  readonly buildings = signal<Building[]>([]);
  readonly loading = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    ownersName: ['', Validators.required],
    buildingsAddress: ['', Validators.required],
    buildingsName: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadBuildings();
  }

  loadBuildings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.buildingService.list().subscribe({
      next: (buildings) => {
        this.buildings.set(buildings);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Buildings load failed', err);
        this.error.set('No fue posible cargar los edificios.');
        this.loading.set(false);
      }
    });
  }

  resetForm(): void {
    this.form.reset({
      id: null,
      ownersName: '',
      buildingsAddress: '',
      buildingsName: ''
    });
    this.feedback.set(null);
    this.error.set(null);
  }

  edit(building: Building): void {
    this.form.setValue({
      id: building.id ?? null,
      ownersName: building.ownersName,
      buildingsAddress: building.buildingsAddress,
      buildingsName: building.buildingsName
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, ...buildingData } = this.form.getRawValue();
    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    const request = id
      ? this.buildingService.update({ id, ...buildingData })
      : this.buildingService.create(buildingData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set(id ? 'Edificio actualizado correctamente.' : 'Edificio creado correctamente.');
        this.resetForm();
        this.loadBuildings();
      },
      error: (err) => {
        console.error('Building save failed', err);
        this.error.set('No fue posible guardar el edificio.');
        this.loading.set(false);
      }
    });
  }

  remove(building: Building): void {
    if (!building.id) {
      return;
    }

    const confirmed = window.confirm(`¿Eliminar el edificio "${building.buildingsName}"?`);
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.feedback.set(null);
    this.error.set(null);

    this.buildingService.delete(building.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.feedback.set('Edificio eliminado correctamente.');
        this.loadBuildings();
      },
      error: (err) => {
        console.error('Building delete failed', err);
        this.error.set('No fue posible eliminar el edificio.');
        this.loading.set(false);
      }
    });
  }

  trackById(_index: number, item: Building): number | undefined {
    return item.id;
  }
}
