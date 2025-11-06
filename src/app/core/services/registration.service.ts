import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { API_APP_V1_URL } from '../constants/api.constants';

export type RegistrationRole = 'therapist' | 'user' | 'patient';

export interface BaseRegistrationPayload {
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  docType: string;
  document: string;
  email: string;
  telephone?: string;
  phoneNumber?: string;
  password: string;
  role?: 'TERAPEUTA' | 'USUARIO' | 'PACIENTE';
  [key: string]: unknown;
}

export type TherapistRegistrationPayload = BaseRegistrationPayload & {
  professionalCard?: boolean;
  specialty?: string;
};

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_APP_V1_URL}`;

  registerTherapist(payload: TherapistRegistrationPayload) {
    return this.http.post(`${this.baseUrl}/therapist`, payload);
  }

  registerUser(payload: BaseRegistrationPayload) {
    return this.http.post(`${this.baseUrl}/user`, payload);
  }

  registerPatient(payload: BaseRegistrationPayload) {
    return this.http.post(`${this.baseUrl}/patient`, payload);
  }
}
