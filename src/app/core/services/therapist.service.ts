import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_V1_URL } from '../constants/api.constants';
import { Therapist } from '../models/therapist.model';

@Injectable({ providedIn: 'root' })
export class TherapistService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_V1_URL}/therapists`;

  list(): Observable<Therapist[]> {
    return this.http.get<Therapist[]>(this.baseUrl);
  }

  create(therapist: Omit<Therapist, 'id'>): Observable<Therapist> {
    return this.http.post<Therapist>(this.baseUrl, therapist);
  }

  update(therapist: Therapist): Observable<Therapist> {
    return this.http.put<Therapist>(this.baseUrl, therapist);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
