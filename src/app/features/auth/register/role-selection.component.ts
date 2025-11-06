import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface RoleCard {
  icon: string;
  title: string;
  description: string;
  cta: string;
  link: string[];
}

@Component({
  selector: 'app-register-role-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.css'
})
export class RoleSelectionComponent {
  readonly cards: RoleCard[] = [
    {
      icon: 'domain_add',
      title: 'Gestor de edificios',
      description: 'Organiza los espacios terapéuticos, administra instalaciones y gestiona la disponibilidad.',
      cta: 'Crear cuenta de gestor',
      link: ['/', 'register', 'user']
    },
    {
      icon: 'psychology_alt',
      title: 'Terapeuta',
      description: 'Ofrece tus servicios profesionales, administra tu agenda y conecta con pacientes.',
      cta: 'Soy terapeuta',
      link: ['/', 'register', 'therapist']
    },
    {
      icon: 'groups',
      title: 'Paciente',
      description: 'Solicita citas con terapeutas en edificios cercanos y lleva el control de tus reservas.',
      cta: 'Quiero atenderme',
      link: ['/', 'register', 'patient']
    }
  ];
}
