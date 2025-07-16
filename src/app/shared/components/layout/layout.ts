import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Ajoutez Router
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  isMenuOpen = false;
  
  menuItems: MenuItem[] = [
    { name: 'Patient', icon: 'people', route: '/patient' },
    { name: 'Medecin', icon: 'medical_services', route: '/doctor' },
    { name: 'Appointment', icon: 'calendar_today', route: '/appointment' },
    { name: 'Specialiste', icon: 'healing', route: '/specialty' },
    { name: 'Notification', icon: 'notifications', route: '/notification' },
    { name: 'TimeSlot', icon: 'notifications', route: '/timeSlot' },
    { name: 'DoctorSpecialite', icon: 'healing', route: '/doctorSpecialty' }


  ];

  constructor(private router: Router) {} 

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }

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