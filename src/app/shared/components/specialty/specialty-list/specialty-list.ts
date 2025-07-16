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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import Swal from 'sweetalert2';
import { Specialty } from '../../../../core/models/specialty.model';
import { SpecialtyService } from '../../../../core/services/specialty';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { SpecialtyForm } from '../specialty-form/specialty-form';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";



@Component({
  selector: 'app-specialty-list',
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
  templateUrl: './specialty-list.html',
  styleUrl: './specialty-list.css'
})
export class SpecialtyList implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: Specialty[] = [];
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  searchCriteria = {
    name: '',
    description: ''
  };
  isLoading = false;

  constructor(
    private specialtyService: SpecialtyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.loadSpecialties();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Liste des Spécialités', url: '/specialties' }
    ]);
  }

  loadSpecialties(): void {
    this.isLoading = true;
    this.specialtyService.getAllSpecialties(this.currentPage, this.pageSize)
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
    this.specialtyService.searchByCriteria(this.searchCriteria, this.currentPage, this.pageSize)
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
      name: '',
      description: ''
    };
    this.currentPage = 0;
    this.loadSpecialties();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSearchActive()) {
      this.onSearch();
    } else {
      this.loadSpecialties();
    }
  }

  isSearchActive(): boolean {
    return Object.values(this.searchCriteria).some(val => val !== '');
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SpecialtyForm, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSpecialties();
      }
    });
  }

  openEditDialog(specialty: Specialty): void {
    const dialogRef = this.dialog.open(SpecialtyForm, {
      width: '600px',
      data: { mode: 'edit', specialty }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSpecialties();
      }
    });
  }

  deleteSpecialty(id: number): void {
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
        this.specialtyService.deleteSpecialty(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'La spécialité a été supprimée.',
              'success'
            );
            this.loadSpecialties();
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
