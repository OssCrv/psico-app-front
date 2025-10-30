import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_V1_URL } from '../constants/api.constants';
import { Reservation } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_V1_URL}/reservations`;

  list(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  create(reservation: Omit<Reservation, 'id' | 'facilityDto' | 'therapistDto'>): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, reservation);
  }

  update(reservation: Omit<Reservation, 'facilityDto' | 'therapistDto'>): Observable<Reservation> {
    return this.http.put<Reservation>(this.baseUrl, reservation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
