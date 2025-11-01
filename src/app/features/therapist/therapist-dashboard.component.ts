import { Component } from '@angular/core';

@Component({
  selector: 'app-therapist-dashboard',
  standalone: true,
  template: `
    <section class="role-page">
      <h1>Panel de terapeutas</h1>
      <p>Bienvenido al área de terapeutas. Aquí podrás gestionar tus sesiones y pacientes.</p>
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
export class TherapistDashboardComponent {}
