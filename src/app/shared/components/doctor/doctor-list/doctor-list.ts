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
import { Doctor } from '../../../../core/models/doctor.model';
import { DoctorService } from '../../../../core/services/doctor';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DoctorForm } from '../doctor-form/doctor-form';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import Swal from 'sweetalert2';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";

@Component({
  selector: 'app-doctor-list',
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
    BreadcrumbComponent
],
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.css'
})
export class DoctorList implements OnInit{
  displayedColumns: string[] = ['id', 'licenseNumber', 'lastName', 'firstName', 'email', 'phoneNumber', 'available', 'actions'];
  dataSource: Doctor[] = [];
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  searchCriteria = {
    lastName: '',
    firstName: '',
    email: '',
    licenseNumber: '',
    phoneNumber: ''
  };
  isLoading = false;

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb 
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.loadDoctors();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Liste des Médecins', url: '/doctors' }
    ]);
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAllDoctors(this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.dataSource = page.content;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des médecins', 'Fermer', {
            duration: 3000
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.isLoading = true;
    this.doctorService.searchByCriteria(this.searchCriteria, this.currentPage, this.pageSize)
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
      licenseNumber: '',
      phoneNumber: ''
    };
    this.currentPage = 0;
    this.loadDoctors();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSearchActive()) {
      this.onSearch();
    } else {
      this.loadDoctors();
    }
  }

  isSearchActive(): boolean {
    return Object.values(this.searchCriteria).some(val => val !== '');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(DoctorForm, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  openEditDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorForm, {
      width: '600px',
      data: { mode: 'edit', doctor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  deleteDoctor(id: number): void {
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
        this.doctorService.deleteDoctor(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'Le médecin a été supprimé.',
              'success'
            );
            this.loadDoctors();
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
