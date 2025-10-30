import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { AuthenticationRequest, AuthenticationResponse } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly url = `${API_BASE_URL}/auth/authenticate`;

  authenticate(request: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(this.url, request).pipe(
      tap((response) => this.tokenService.setToken(response.token))
    );
  }

  logout(): void {
    this.tokenService.clearToken();
  }
}
