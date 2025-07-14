import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../../../core/services/patient';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: 'app-patient-form',
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
    MatIconModule
],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css'
})
export class PatientForm implements OnInit {
 patientForm: FormGroup;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private dialogRef: MatDialogRef<PatientForm>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', patient?: Patient },
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      id: [null],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    this.isEditMode = this.data.mode === 'edit';
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.patient) {
      this.patientForm.patchValue(this.data.patient);
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    this.isLoading = true;
    const patientData = this.patientForm.value;

    const operation = this.isEditMode
      ? this.patientService.updatePatient(patientData.id, patientData)
      : this.patientService.createPatient(patientData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Patient ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open(
          `Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'} du patient`,
          'Fermer',
          { duration: 3000 }
        );
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(controlName: string): string {
    const control = this.patientForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    } else if (control?.hasError('email')) {
      return 'Email invalide';
    } else if (control?.hasError('pattern')) {
      return 'Numéro de téléphone invalide (10 chiffres requis)';
    } else if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    }
    
    return '';
  }
}
