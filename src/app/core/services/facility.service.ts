import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_V1_URL } from '../constants/api.constants';
import { Facility } from '../models/facility.model';

@Injectable({ providedIn: 'root' })
export class FacilityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_V1_URL}/facilities`;

  list(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.baseUrl);
  }

  create(facility: Omit<Facility, 'id' | 'buildingDto'>): Observable<Facility> {
    return this.http.post<Facility>(this.baseUrl, facility);
  }

  update(facility: Omit<Facility, 'buildingDto'>): Observable<Facility> {
    return this.http.put<Facility>(this.baseUrl, facility);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
