import { Component } from '@angular/core';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  template: `
    <section class="role-page">
      <h1>Portal de pacientes</h1>
      <p>Consulta tus próximas citas y material de acompañamiento.</p>
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
export class PatientDashboardComponent {}
