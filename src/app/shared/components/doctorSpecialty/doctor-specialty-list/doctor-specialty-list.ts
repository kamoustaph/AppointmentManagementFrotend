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
import { DoctorSpecialty } from '../../../../core/models/doctor-specialty.model';
import { DoctorSpecialtyService } from '../../../../core/services/doctor-specialty';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DoctorSpecialtyForm } from '../doctor-specialty-form/doctor-specialty-form';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-doctor-specialty-list',
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
    BreadcrumbComponent
],
  templateUrl: './doctor-specialty-list.html',
  styleUrl: './doctor-specialty-list.css'
})
export class DoctorSpecialtyList implements OnInit{
  displayedColumns: string[] = ['id', 'doctorName', 'specialtyName', 'actions'];
  dataSource: DoctorSpecialty[] = [];
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  searchCriteria = {
    doctorId: undefined as number | undefined,
    specialtyId: undefined as number | undefined
  };
  isLoading = false;

  constructor(
    private doctorSpecialtyService: DoctorSpecialtyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb 
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.loadDoctorSpecialties();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Liste des Spécialités des Médecins', url: '/doctor-specialties' }
    ]);
  }

  loadDoctorSpecialties(): void {
    this.isLoading = true;
    this.doctorSpecialtyService.getAllDoctorSpecialties(this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.dataSource = page.content;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des spécialités', 'Fermer', {
            duration: 3000
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.isLoading = true;
    this.doctorSpecialtyService.searchByCriteria(this.searchCriteria, this.currentPage, this.pageSize)
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
      doctorId: undefined,
      specialtyId: undefined
    };
    this.currentPage = 0;
    this.loadDoctorSpecialties();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSearchActive()) {
      this.onSearch();
    } else {
      this.loadDoctorSpecialties();
    }
  }

  isSearchActive(): boolean {
    return Object.values(this.searchCriteria).some(val => val !== undefined);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DoctorSpecialtyForm, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctorSpecialties();
      }
    });
  }

  openEditDialog(doctorSpecialty: DoctorSpecialty): void {
    const dialogRef = this.dialog.open(DoctorSpecialtyForm, {
      width: '600px',
      data: { mode: 'edit', doctorSpecialty }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctorSpecialties();
      }
    });
  }

  deleteDoctorSpecialty(id: number): void {
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
        this.doctorSpecialtyService.deleteDoctorSpecialty(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'La spécialité du médecin a été supprimée.',
              'success'
            );
            this.loadDoctorSpecialties();
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
  }



