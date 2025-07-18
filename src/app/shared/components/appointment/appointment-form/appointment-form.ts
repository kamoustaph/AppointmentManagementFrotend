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
      this.patchFormValues(this.data.appointment);
      this.onSpecialtyOrDateChange();
    }

    this.appointmentForm.get('date')?.valueChanges.subscribe(() => {
      this.onSpecialtyOrDateChange();
    });

    this.appointmentForm.get('specialtyId')?.valueChanges.subscribe(() => {
      this.onSpecialtyOrDateChange();
    });
  }

  private patchFormValues(appointment: Appointment): void {
    this.appointmentForm.patchValue({
      id: appointment.id,
      date: new Date(appointment.date),
      status: appointment.status,
      patientId: appointment.patient?.id || appointment.patientId,
      specialtyId: appointment.specialty?.id || appointment.specialtyId,
      timeSlotId: appointment.timeSlot?.id || appointment.timeSlotId
    });
  }

  private setupBreadcrumb(): void {
    const breadcrumbs = [
      { label: 'Liste des Rendez-vous', url: '/appointments' },
      { label: this.isEditMode ? 'Modifier' : 'Créer', url: '' }
    ];
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
  const formValue = this.appointmentForm.value;

  const appointmentData: Appointment = {
    id: formValue.id,
    date: formValue.date,
    status: formValue.status,
    patientId: formValue.patientId,
    specialtyId: formValue.specialtyId,
    timeSlotId: formValue.timeSlotId
  };

  if (this.isEditMode) {
    // En mode édition, on est sûr d'avoir un ID
    if (!appointmentData.id) {
      this.snackBar.open('ID du rendez-vous manquant', 'Fermer', { duration: 3000 });
      this.isLoading = false;
      return;
    }
    this.appointmentService.updateAppointment(appointmentData.id, appointmentData).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous modifié avec succès', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open(
          `Erreur lors de la modification du rendez-vous: ${error.message}`,
          'Fermer',
          { duration: 5000 }
        );
        this.isLoading = false;
      }
    });
  } else {
    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: () => {
        this.snackBar.open('Rendez-vous créé avec succès', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open(
          `Erreur lors de la création du rendez-vous: ${error.message}`,
          'Fermer',
          { duration: 5000 }
        );
        this.isLoading = false;
      }
    });
  }
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