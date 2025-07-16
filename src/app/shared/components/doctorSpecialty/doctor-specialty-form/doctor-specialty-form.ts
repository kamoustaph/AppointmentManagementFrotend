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
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DoctorSpecialty } from '../../../../core/models/doctor-specialty.model';
import { DoctorSpecialtyService } from '../../../../core/services/doctor-specialty';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";
import { Doctor } from '../../../../core/models/doctor.model';
import { Specialty } from '../../../../core/models/specialty.model';

@Component({
  selector: 'app-doctor-specialty-form',
 standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BreadcrumbComponent
],
  templateUrl: './doctor-specialty-form.html',
  styleUrl: './doctor-specialty-form.css'
})
export class DoctorSpecialtyForm implements OnInit{
 doctorSpecialtyForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  doctors: Doctor[] = [];
  specialties: Specialty[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorSpecialtyService: DoctorSpecialtyService,
    private dialogRef: MatDialogRef<DoctorSpecialtyForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; doctorSpecialty?: DoctorSpecialty },
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {
    this.doctorSpecialtyForm = this.fb.group({
      id: [null],
      doctorId: ['', Validators.required],
      specialtyId: ['', Validators.required]
    });

    this.isEditMode = this.data.mode === 'edit';
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadSpecialties();
    this.setupBreadcrumb();

    if (this.isEditMode && this.data.doctorSpecialty) {
      this.doctorSpecialtyForm.patchValue(this.data.doctorSpecialty);
    }
  }

  loadDoctors(): void {
    this.doctorSpecialtyService.getAllDoctors().subscribe({
      next: (doctors) => this.doctors = doctors,
      error: () => this.snackBar.open('Erreur de chargement des médecins', 'Fermer')
    });
  }

  loadSpecialties(): void {
    this.doctorSpecialtyService.getAllSpecialties().subscribe({
      next: (specialties) => this.specialties = specialties,
      error: () => this.snackBar.open('Erreur de chargement des spécialités', 'Fermer')
    });
  }

  private setupBreadcrumb(): void {
    const breadcrumbs = [
      { label: this.isEditMode ? 'Modifier Association' : 'Nouvelle Association', url: '' }
    ];
    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }
onSubmit(): void {
  if (this.doctorSpecialtyForm.invalid) {
    return;
  }

  this.isLoading = true;
  const formValue = this.doctorSpecialtyForm.value;
  const doctorSpecialtyData = {
    doctorId: formValue.doctor.id,
    specialtyId: formValue.specialty.id
  };

  const operation = this.isEditMode
    ? this.doctorSpecialtyService.updateDoctorSpecialty(this.data.doctorSpecialty?.id || 0, doctorSpecialtyData)
    : this.doctorSpecialtyService.createDoctorSpecialty(doctorSpecialtyData);

  operation.subscribe({
    next: () => {
      this.snackBar.open(
        `Association ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`,
        'Fermer',
        { duration: 3000 }
      );
      this.dialogRef.close(true);
    },
    error: () => {
      this.snackBar.open(
        `Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'} de l'association`,
        'Fermer',
        { duration: 3000 }
      );
      this.isLoading = false;
    }
  });
}

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
