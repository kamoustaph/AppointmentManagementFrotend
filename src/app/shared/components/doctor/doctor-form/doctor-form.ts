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
import { Doctor } from '../../../../core/models/doctor.model';
import { DoctorService } from '../../../../core/services/doctor';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";
@Component({
  selector: 'app-doctor-form',
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
    MatCheckboxModule,
    BreadcrumbComponent
],
  templateUrl: './doctor-form.html',
  styleUrl: './doctor-form.css'
})
export class DoctorForm implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private dialogRef: MatDialogRef<DoctorForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; doctor?: Doctor },
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {
    this.doctorForm = this.fb.group({
      id: [null],
      licenseNumber: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      birthDate: [''],
      available: [true]
    });

    this.isEditMode = this.data.mode === 'edit';
  }

  ngOnInit(): void {
    this.setupBreadcrumb();

    if (this.isEditMode && this.data.doctor) {
      this.doctorForm.patchValue(this.data.doctor);
    }
  }

  private setupBreadcrumb(): void {
    const breadcrumbs = [];
    
    if (this.isEditMode) {
      breadcrumbs.push({ label: 'Modifier Médecin', url: '' });
    } else {
      breadcrumbs.push({ label: 'Nouveau Médecin', url: '' });
    }

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      return;
    }

    this.isLoading = true;
    const doctorData = this.doctorForm.value;

    const operation = this.isEditMode
      ? this.doctorService.updateDoctor(doctorData.id, doctorData)
      : this.doctorService.createDoctor(doctorData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Médecin ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
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
          } du médecin`,
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
    const control = this.doctorForm.get(controlName);

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
