import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_V1_URL } from '../constants/api.constants';
import { Building } from '../models/building.model';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_V1_URL}/buildings`;

  list(): Observable<Building[]> {
    return this.http.get<Building[]>(this.baseUrl);
  }

  create(building: Omit<Building, 'id'>): Observable<Building> {
    return this.http.post<Building>(this.baseUrl, building);
  }

  update(building: Building): Observable<Building> {
    return this.http.put<Building>(this.baseUrl, building);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
