import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { TokenService } from '../core/services/token.service';

interface NavItem {
  label: string;
  link: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly tokenService = inject(TokenService);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', link: '/admin' },
    { label: 'Edificios', link: '/admin/buildings' },
    { label: 'Consultorios', link: '/admin/facilities' },
    { label: 'Terapeutas', link: '/admin/therapists' },
    { label: 'Usuarios', link: '/admin/users' },
    { label: 'Reservas', link: '/admin/reservations' }
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
