import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { AuthenticationRequest, AuthenticationResponse } from '../models/auth.model';
import { TokenService } from './token.service';

export type UserRole = 'ADMIN' | 'USUARIO' | 'TERAPEUTA' | 'PACIENTE';

interface JwtPayload {
  role?: UserRole;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly url = `${API_BASE_URL}/auth/authenticate`;

  authenticate(request: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(this.url, request).pipe(
      tap((response) => {
        const token = this.extractToken(response);

        if (!token) {
          throw new Error('Token no presente en la respuesta de autenticación.');
        }

        this.tokenService.setToken(token);
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
  }

  isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }

  getRole(): UserRole | null {
    const payload = this.getPayload();
    return payload?.role ?? null;
  }

  private getPayload(): JwtPayload | null {
    const token = this.tokenService.getToken();

    if (!token) {
      return null;
    }

    const [, payloadSegment] = token.split('.');

    if (!payloadSegment) {
      return null;
    }

    const base64 = this.normalizeBase64(payloadSegment);

    try {
      const json = typeof atob === 'function' ? atob(base64) : globalThis.atob?.(base64);

      if (!json) {
        return null;
      }

      return JSON.parse(json) as JwtPayload;
    } catch (error) {
      console.warn('No se pudo decodificar el token JWT.', error);
      return null;
    }
  }

  private normalizeBase64(segment: string): string {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;

    if (padding === 2) {
      return `${base64}==`;
    }

    if (padding === 3) {
      return `${base64}=`;
    }

    return base64;
  }

  private extractToken(response: AuthenticationResponse): string | undefined {
    return response.token ?? response.jwt;
  }
}
