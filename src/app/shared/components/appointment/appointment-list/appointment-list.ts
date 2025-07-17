// appointment-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Appointment, AppointmentStatus, Page } from '../../../../core/models/appointment.model';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";
import Swal from 'sweetalert2';
import { MatChipsModule } from '@angular/material/chips';


import { AppointmentService } from '../../../../core/services/appointment';
import { AppointmentFormComponent } from '../appointment-form/appointment-form';
@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BreadcrumbComponent,
    MatChipsModule,

],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css'
})
export class AppointmentList implements OnInit{

  displayedColumns: string[] = ['id', 'date', 'patient', 'specialty', 'timeSlot', 'status', 'actions'];
  dataSource: Appointment[] = [];
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  searchCriteria = {
    patientId: undefined as number | undefined,
    specialtyId: undefined as number | undefined,
    timeSlotId: undefined as number | undefined,
    status: undefined as AppointmentStatus | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined
  };
  statusOptions = Object.values(AppointmentStatus);
  isLoading = false;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.loadAppointments();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Liste des Rendez-vous', url: '/appointments' }
    ]);
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.appointmentService.getAllAppointments(this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.dataSource = page.content;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
            duration: 3000
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.isLoading = true;
    this.appointmentService.searchAppointments(this.searchCriteria, this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.dataSource = page.content;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors de la recherche', 'Fermer', {
            duration: 3000
          });
        }
      });
  }

  clearSearch(): void {
    this.searchCriteria = {
      patientId: undefined,
      specialtyId: undefined,
      timeSlotId: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined
    };
    this.currentPage = 0;
    this.loadAppointments();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSearchActive()) {
      this.onSearch();
    } else {
      this.loadAppointments();
    }
  }

  isSearchActive(): boolean {
    return Object.values(this.searchCriteria).some(val => val !== undefined && val !== '');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '800px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  openEditDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '800px',
      data: { mode: 'edit', appointment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  deleteAppointment(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas annuler cette action !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'Le rendez-vous a été supprimé.',
              'success'
            );
            this.loadAppointments();
          },
          error: () => {
            Swal.fire(
              'Erreur !',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          }
        });
      }
    });
  }

  confirmAppointment(id: number): void {
    this.appointmentService.confirmAppointment(id).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous confirmé avec succès', 'Fermer', { duration: 3000 });
        this.loadAppointments();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la confirmation', 'Fermer', { duration: 3000 });
      }
    });
  }

  cancelAppointment(id: number): void {
    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous annulé avec succès', 'Fermer', { duration: 3000 });
        this.loadAppointments();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'annulation', 'Fermer', { duration: 3000 });
      }
    });
  }

  completeAppointment(id: number): void {
    this.appointmentService.completeAppointment(id).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous marqué comme terminé', 'Fermer', { duration: 3000 });
        this.loadAppointments();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  getStatusColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return 'primary';
      case AppointmentStatus.COMPLETED:
        return 'success';
      case AppointmentStatus.CANCELLED:
        return 'warn';
      case AppointmentStatus.MISSED:
        return 'accent';
      default:
        return '';
    }
  }


}
