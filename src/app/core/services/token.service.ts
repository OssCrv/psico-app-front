import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly storageKey = 'psico_app_token';
  private readonly isBrowser = typeof window !== 'undefined';
  private readonly storedToken = this.isBrowser ? localStorage.getItem(this.storageKey) : null;
  private readonly tokenSignal = signal<string | null>(this.storedToken);

  readonly token = computed(() => this.tokenSignal());

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  setToken(token: string): void {
    this.tokenSignal.set(token);
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, token);
    }
  }

  clearToken(): void {
    this.tokenSignal.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(this.storageKey);
    }
  }
}
