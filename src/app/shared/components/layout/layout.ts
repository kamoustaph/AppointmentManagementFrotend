import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
}
@Component({
  selector: 'app-layout',
   standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
menuItems: MenuItem[] = [
    { name: 'Patient', icon: 'bi bi-people', route: '/patient' },
    { name: 'Medecin', icon: 'bi bi-person-badge', route: '/medecin' },
    { name: 'Appointment', icon: 'bi bi-calendar-check', route: '/appointment' },
    { name: 'MedecinSpecialiste', icon: 'bi bi-heart-pulse', route: '/medecin-specialiste' },
    { name: 'Notification', icon: 'bi bi-bell', route: '/notification' }
  ];

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }
}
