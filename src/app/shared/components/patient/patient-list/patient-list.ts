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
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../../../core/services/patient';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PatientForm } from '../patient-form/patient-form';

@Component({
  selector: 'app-patient-list',
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
    MatProgressSpinnerModule
],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css'
})
export class PatientList implements OnInit {
  displayedColumns: string[] = ['id', 'lastName', 'firstName', 'email', 'phoneNumber', 'actions'];
  dataSource: Patient[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  searchCriteria = {
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: ''
  };
  isLoading = false;

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    this.patientService.getAllPatients(this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.dataSource = page.content;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des patients', 'Fermer', {
            duration: 3000
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.isLoading = true;
    this.patientService.searchByCriteria(this.searchCriteria, this.currentPage, this.pageSize)
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
      lastName: '',
      firstName: '',
      email: '',
      phoneNumber: ''
    };
    this.currentPage = 0;
    this.loadPatients();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSearchActive()) {
      this.onSearch();
    } else {
      this.loadPatients();
    }
  }

  isSearchActive(): boolean {
    return Object.values(this.searchCriteria).some(val => val !== '');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PatientForm, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  openEditDialog(patient: Patient): void {
    const dialogRef = this.dialog.open(PatientForm, {
      width: '600px',
      data: { mode: 'edit', patient }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();
      }
    });
  }

  deletePatient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          this.snackBar.open('Patient supprimé avec succès', 'Fermer', {
            duration: 3000
          });
          this.loadPatients();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}