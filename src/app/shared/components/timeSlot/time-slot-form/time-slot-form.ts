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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../../../../core/models/time-slot.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TimeSlotService } from '../../../../core/services/time-slot';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";

@Component({
  selector: 'app-time-slot-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    BreadcrumbComponent
],

  templateUrl: './time-slot-form.html',
  styleUrl: './time-slot-form.css'
})
export class TimeSlotForm implements OnInit{
  timeSlotForm: FormGroup;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private timeSlotService: TimeSlotService,
    private dialogRef: MatDialogRef<TimeSlotForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; timeSlot?: TimeSlot },
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {
    this.timeSlotForm = this.fb.group({
      id: [null],
      slotDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      available: [true],
      doctorId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    this.isEditMode = this.data.mode === 'edit';
  }

  ngOnInit(): void {
    this.setupBreadcrumb();

    if (this.isEditMode && this.data.timeSlot) {
      this.timeSlotForm.patchValue(this.data.timeSlot);
    }
  }

  private setupBreadcrumb(): void {
    const breadcrumbs = [];
    
    if (this.isEditMode) {
      breadcrumbs.push({ label: 'Modifier Créneau', url: '' });
    } else {
      breadcrumbs.push({ label: 'Nouveau Créneau', url: '' });
    }

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  onSubmit(): void {
    if (this.timeSlotForm.invalid) {
      return;
    }

    this.isLoading = true;
    const timeSlotData = this.timeSlotForm.value;

    const operation = this.isEditMode
      ? this.timeSlotService.updateTimeSlot(timeSlotData.id, timeSlotData)
      : this.timeSlotService.createTimeSlot(timeSlotData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Créneau ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
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
          } du créneau`,
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
    const control = this.timeSlotForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    } else if (control?.hasError('pattern')) {
      return 'Valeur numérique requise';
    }

    return '';
  }
}
