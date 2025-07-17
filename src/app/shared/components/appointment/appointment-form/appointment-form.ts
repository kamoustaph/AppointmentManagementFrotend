// appointment-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb';
import {
  Appointment,
  AppointmentStatus,
} from '../../../../core/models/appointment.model';
import { Patient } from '../../../../core/models/patient.model';
import { Specialty } from '../../../../core/models/specialty.model';
import { AppointmentService } from '../../../../core/services/appointment';
import { TimeSlot } from '../../../../core/models/time-slot.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BreadcrumbComponent,
  ],
  templateUrl: './appointment-form.html',
  styleUrls: ['./appointment-form.css'],
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isTimeSlotsLoading = false;

  statusOptions = Object.values(AppointmentStatus);
  patients: Patient[] = [];
  specialties: Specialty[] = [];
  timeSlots: TimeSlot[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; appointment?: Appointment },
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {
    this.appointmentForm = this.fb.group({
      id: [null],
      date: ['', Validators.required],
      status: ['PENDING', Validators.required],
      patientId: ['', Validators.required],
      specialtyId: ['', Validators.required],
      timeSlotId: [{ value: '', disabled: true }, Validators.required],
    });

    this.isEditMode = this.data.mode === 'edit';
  }

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.loadPatients();
    this.loadSpecialties();

    if (this.isEditMode && this.data.appointment) {
      this.appointmentForm.patchValue(this.data.appointment);
      this.onSpecialtyOrDateChange();
    }

    // Écouter les changements de date ou de spécialité
    this.appointmentForm.get('date')?.valueChanges.subscribe(() => {
      this.onSpecialtyOrDateChange();
    });

    this.appointmentForm.get('specialtyId')?.valueChanges.subscribe(() => {
      this.onSpecialtyOrDateChange();
    });
  }

  private setupBreadcrumb(): void {
    const breadcrumbs = [];

    if (this.isEditMode) {
      breadcrumbs.push({ label: 'Modifier Rendez-vous', url: '' });
    } else {
      breadcrumbs.push({ label: 'Nouveau Rendez-vous', url: '' });
    }

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  private loadPatients(): void {
    this.isLoading = true;
    this.appointmentService.getAllPatients().subscribe({
      next: (page) => {
        this.patients = page.content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement des patients', 'Fermer', {
          duration: 3000,
        });
      },
    });
  }

  private loadSpecialties(): void {
    this.isLoading = true;
    this.appointmentService.getAllSpecialties().subscribe({
      next: (page) => {
        this.specialties = page.content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open(
          'Erreur lors du chargement des spécialités',
          'Fermer',
          { duration: 3000 }
        );
      },
    });
  }
  private onSpecialtyOrDateChange(): void {
    const dateValue = this.appointmentForm.get('date')?.value;
    const specialtyId = this.appointmentForm.get('specialtyId')?.value;

    if (dateValue && specialtyId) {
      this.isTimeSlotsLoading = true;
      this.appointmentForm.get('timeSlotId')?.disable();

      // Convertir la date au format Date si ce n'est pas déjà fait
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

      this.appointmentService
        .getAvailableTimeSlots(date, specialtyId)
        .subscribe({
          next: (timeSlots) => {
            this.timeSlots = timeSlots;
            this.appointmentForm.get('timeSlotId')?.enable();
            this.isTimeSlotsLoading = false;
          },
          error: () => {
            this.timeSlots = [];
            this.appointmentForm.get('timeSlotId')?.reset();
            this.appointmentForm.get('timeSlotId')?.disable();
            this.isTimeSlotsLoading = false;
            this.snackBar.open(
              'Erreur lors du chargement des créneaux',
              'Fermer',
              { duration: 3000 }
            );
          },
        });
    } else {
      this.timeSlots = [];
      this.appointmentForm.get('timeSlotId')?.reset();
      this.appointmentForm.get('timeSlotId')?.disable();
    }
  }
  displayPatient(patient: Patient): string {
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  }

  displaySpecialty(specialty: Specialty): string {
    return specialty ? specialty.name : '';
  }

  displayTimeSlot(timeSlot: TimeSlot): string {
    return timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : '';
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    this.isLoading = true;
    const appointmentData = this.appointmentForm.value;

    const operation = this.isEditMode
      ? this.appointmentService.updateAppointment(
          appointmentData.id,
          appointmentData
        )
      : this.appointmentService.createAppointment(appointmentData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Rendez-vous ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open(
          `Erreur lors de ${
            this.isEditMode ? 'la modification' : 'la création'
          } du rendez-vous`,
          'Fermer',
          { duration: 3000 }
        );
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(controlName: string): string {
    const control = this.appointmentForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }

    return '';
  }
}
