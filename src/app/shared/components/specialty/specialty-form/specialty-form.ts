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
import { CommonModule } from '@angular/common';
import { Specialty } from '../../../../core/models/specialty.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SpecialtyService } from '../../../../core/services/specialty';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";


@Component({
  selector: 'app-specialty-form',
 standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BreadcrumbComponent
],
  templateUrl: './specialty-form.html',
  styleUrl: './specialty-form.css'
})
export class SpecialtyForm {
 specialtyForm: FormGroup;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private specialtyService: SpecialtyService,
    private dialogRef: MatDialogRef<SpecialtyForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; specialty?: Specialty },
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {
    this.specialtyForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(3000)]],
    });

    this.isEditMode = this.data.mode === 'edit';
  }

  ngOnInit(): void {
    this.setupBreadcrumb();

    if (this.isEditMode && this.data.specialty) {
      this.specialtyForm.patchValue(this.data.specialty);
    }
  }

  private setupBreadcrumb(): void {
    const breadcrumbs = [];
    
    if (this.isEditMode) {
      breadcrumbs.push({ label: 'Modifier Spécialité', url: '' });
    } else {
      breadcrumbs.push({ label: 'Nouvelle Spécialité', url: '' });
    }

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  onSubmit(): void {
    if (this.specialtyForm.invalid) {
      return;
    }

    this.isLoading = true;
    const specialtyData = this.specialtyForm.value;

    const operation = this.isEditMode
      ? this.specialtyService.updateSpecialty(specialtyData.id, specialtyData)
      : this.specialtyService.createSpecialty(specialtyData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Spécialité ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`,
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
          } de la spécialité`,
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
    const control = this.specialtyForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    } else if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    }

    return '';
  }
}
