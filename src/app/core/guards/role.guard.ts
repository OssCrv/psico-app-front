import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService, UserRole } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      return this.router.createUrlTree(['/login']);
    }

    const allowedRoles = (route.data?.['roles'] ?? []) as UserRole[];
    const userRole = this.authService.getRole();

    if (!allowedRoles.length || (userRole && allowedRoles.includes(userRole))) {
      return true;
    }

    return this.router.createUrlTree(['/forbidden']);
  }
}
