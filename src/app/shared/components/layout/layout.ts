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
  styleUrls: ['./layout.css']
})
export class Layout {
  isMenuOpen = false;
  
  menuItems: MenuItem[] = [
    { name: 'Patient', icon: 'bi bi-people', route: '/patient' },
    { name: 'Medecin', icon: 'bi bi-person-badge', route: '/medecin' },
    { name: 'Appointment', icon: 'bi bi-calendar-check', route: '/appointment' },
    { name: 'MedecinSpecialiste', icon: 'bi bi-heart-pulse', route: '/medecin-specialiste' },
    { name: 'Notification', icon: 'bi bi-bell', route: '/notification' }
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenuOnMobile() {
    if (window.innerWidth <= 768) {
      this.toggleMenu();
    }
  }

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }
}