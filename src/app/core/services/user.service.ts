import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_V1_URL } from '../constants/api.constants';
import { CreateUserRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${API_V1_URL}/users`;

  listAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${API_V1_URL}/admins`);
  }

  listTherapists(): Observable<User[]> {
    return this.http.get<User[]>(`${API_V1_URL}/therapists`);
  }

  listActive(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  listAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/all`);
  }

  create(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.usersUrl, request);
  }
}
