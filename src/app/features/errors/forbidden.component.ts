import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  template: `
    <section class="forbidden">
      <h1>Acceso denegado</h1>
      <p>No cuentas con permisos para acceder a este recurso.</p>
    </section>
  `,
  styles: [
    `
      .forbidden {
        margin: 4rem auto;
        max-width: 480px;
        text-align: center;
      }

      .forbidden h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .forbidden p {
        color: #555;
      }
    `
  ]
})
export class ForbiddenComponent {}
