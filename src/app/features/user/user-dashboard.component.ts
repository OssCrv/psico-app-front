import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  template: `
    <section class="role-page">
      <h1>Área de usuarios</h1>
      <p>Accede a tus herramientas y recursos disponibles.</p>
    </section>
  `,
  styles: [
    `
      .role-page {
        margin: 2rem auto;
        max-width: 720px;
      }

      .role-page h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .role-page p {
        color: #555;
      }
    `
  ]
})
export class UserDashboardComponent {}
