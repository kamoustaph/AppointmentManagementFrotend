import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorSpecialtyService } from '../../../../core/services/doctor-specialty';
import { Doctor } from '../../../../core/models/doctor.model';
import { Specialty } from '../../../../core/models/specialty.model';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-doctor-specialty-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './doctor-specialty-form.html',
  styleUrls: ['./doctor-specialty-form.css']
})
export class DoctorSpecialtyForm implements OnInit {
  doctorSpecialtyForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  doctors: Doctor[] = [];
  specialties: Specialty[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorSpecialtyService: DoctorSpecialtyService,
    private dialogRef: MatDialogRef<DoctorSpecialtyForm>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; doctorSpecialty?: any },
    private snackBar: MatSnackBar
  ) {
    this.doctorSpecialtyForm = this.fb.group({
      doctor: [null, Validators.required],
      specialty: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    forkJoin({
      doctors: this.doctorSpecialtyService.getAllDoctors().pipe(
        map(response => Array.isArray(response) ? response : [response])
      ),
      specialties: this.doctorSpecialtyService.getAllSpecialties().pipe(
        map(response => Array.isArray(response) ? response : [response])
      )
    }).subscribe({
      next: ({doctors, specialties}) => {
        this.doctors = doctors;
        this.specialties = specialties;
        
        if (this.isEditMode && this.data.doctorSpecialty) {
          this.patchFormValues();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement:', err);
        this.snackBar.open('Erreur de chargement des données', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private patchFormValues(): void {
    const currentDoctor = this.doctors.find(d => d.id === this.data.doctorSpecialty?.doctor?.id);
    const currentSpecialty = this.specialties.find(s => s.id === this.data.doctorSpecialty?.specialty?.id);
    
    this.doctorSpecialtyForm.patchValue({
      doctor: currentDoctor,
      specialty: currentSpecialty
    });
  }

  compareDoctors(d1: Doctor, d2: Doctor): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  compareSpecialties(s1: Specialty, s2: Specialty): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }

  onSubmit(): void {
    if (this.doctorSpecialtyForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const { doctor, specialty } = this.doctorSpecialtyForm.value;

    const request = {
      doctorId: doctor.id,
      specialtyId: specialty.id
    };

    const operation = this.isEditMode
      ? this.doctorSpecialtyService.updateDoctorSpecialty(this.data.doctorSpecialty.id, request)
      : this.doctorSpecialtyService.createDoctorSpecialty(request);

    operation.subscribe({
      next: () => {
        this.snackBar.open(`Association ${this.isEditMode ? 'modifiée' : 'créée'}`, 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.snackBar.open('Erreur lors de l\'opération', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}