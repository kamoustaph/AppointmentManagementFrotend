import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, stagger, query, state } from '@angular/animations';
import { Breadcrumb } from '../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb";
import { MatIconModule } from '@angular/material/icon';
import { PatientService } from '../../../core/services/patient';
import { finalize } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { DoctorService } from '../../../core/services/doctor';
import { SpecialtyService } from '../../../core/services/specialty';
import { AppointmentService } from '../../../core/services/appointment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    BreadcrumbComponent, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],  
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        query('.dashboard-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('100ms', [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', 
            style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('hoverAnimation', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      })),
      state('hover', style({
        transform: 'translateY(-10px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
      })),
      transition('normal <=> hover', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('pulseAnimation', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hover', style({
        transform: 'scale(1.05)'
      })),
      transition('normal <=> hover', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class Dashboard implements OnInit {
  cards = [
    { 
      title: 'Appointments', 
      count: 0, 
      icon: 'calendar_today',
      color: '#3f51b5',
      loading: false
    },
    { 
      title: 'Doctors', 
      count: 0, 
      icon: 'medical_services',
      color: '#673ab7',
      loading: false
    },
    { 
      title: 'Patients', 
      count: 0, 
      icon: 'people',
      color: '#2196f3',
      loading: true
    },
    { 
      title: 'Specialties', 
      count: 0, 
      icon: 'healing',
      color: '#4caf50', 
      loading: false
    }
  ];

  hoverStates: string[] = Array(this.cards.length).fill('normal');
  isLoading = true;

  constructor(
    private breadcrumbService: Breadcrumb,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private specialtyService: SpecialtyService ,
    private appointmentService: AppointmentService 

  ) {}

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: '', url: '/' }
    ]);
    
    this.loadPatientsCount();
    this.loadDoctorsCount();
    this.loadSpecialtiesCount(); 
     this.loadAppointmentsCount();
  }

loadAppointmentsCount() {
    const appointmentsCard = this.cards.find(c => c.title === 'Appointments');
    if (appointmentsCard) {
        appointmentsCard.loading = true;
        this.appointmentService.getTotalAppointments().pipe(
            finalize(() => {
                appointmentsCard.loading = false;
                this.checkAllLoaded();
            })
        ).subscribe({
            next: (count) => {
                appointmentsCard.count = count;
            },
            error: () => {
                appointmentsCard.count = 0;
            }
        });
    }
}

  loadDoctorsCount() {
    const doctorsCard = this.cards.find(c => c.title === 'Doctors');
    if (doctorsCard) {
      doctorsCard.loading = true;
      this.doctorService.getTotalDoctors().pipe(
        finalize(() => {
          doctorsCard.loading = false;
          this.checkAllLoaded();
        })
      ).subscribe({
        next: (count) => {
          doctorsCard.count = count;
        },
        error: () => {
          doctorsCard.count = 0;
        }
      });
    }
  }

  loadPatientsCount() {
    const patientsCard = this.cards.find(c => c.title === 'Patients');
    if (patientsCard) {
      patientsCard.loading = true;
      this.patientService.getTotalPatients().pipe(
        finalize(() => {
          patientsCard.loading = false;
          this.checkAllLoaded();
        })
      ).subscribe({
        next: (count) => {
          patientsCard.count = count;
        },
        error: () => {
          patientsCard.count = 0;
        }
      });
    }
  }

  loadSpecialtiesCount() {
    const specialtiesCard = this.cards.find(c => c.title === 'Specialties');
    if (specialtiesCard) {
      specialtiesCard.loading = true;
      this.specialtyService.getTotalSpecialties().pipe(
        finalize(() => {
          specialtiesCard.loading = false;
          this.checkAllLoaded();
        })
      ).subscribe({
        next: (count) => {
          specialtiesCard.count = count;
        },
        error: () => {
          specialtiesCard.count = 0;
        }
      });
    }
  }

  checkAllLoaded() {
    this.isLoading = this.cards.some(card => card.loading);
  }

  refreshData() {
    this.isLoading = true;
    this.loadPatientsCount();
    this.loadDoctorsCount();
    this.loadSpecialtiesCount(); 
  }

  setHoverState(index: number, state: string) {
    this.hoverStates[index] = state;
  }
}