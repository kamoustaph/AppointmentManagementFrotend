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
import { TimeSlot } from '../../../../core/models/time-slot.model';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { TimeSlotService } from '../../../../core/services/time-slot';
import { Breadcrumb } from '../../../../core/services/breadcrumb';
import { TimeSlotForm } from '../time-slot-form/time-slot-form';
import { BreadcrumbComponent } from "../../breadcrumb/breadcrumb";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@Component({
  selector: 'app-time-slot-list',
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
    MatDatepickerModule,
    MatNativeDateModule,
    BreadcrumbComponent,
    MatSlideToggleModule

],
  templateUrl: './time-slot-list.html',
  styleUrl: './time-slot-list.css'
})
export class TimeSlotList implements OnInit{

  displayedColumns: string[] = ['id', 'slotDate', 'startTime', 'endTime', 'available', 'actions'];
  dataSource: TimeSlot[] = [];
  totalElements = 0;
  pageSize = 5;
  currentPage = 0;
  searchCriteria = {
    available: undefined as boolean | undefined,
    date: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  };
  isLoading = false;

  constructor(
    private timeSlotService: TimeSlotService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breadcrumbService: Breadcrumb
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.loadTimeSlots();
  }

  private setupBreadcrumb(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Liste des Créneaux Horaires', url: '/time-slots' }
    ]);
  }

  loadTimeSlots(): void {
    this.isLoading = true;
    this.timeSlotService.getAllTimeSlots(this.currentPage, this.pageSize)
      .subscribe({
        next: (page) => {
          this.dataSource = page.content;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des créneaux horaires', 'Fermer', {
            duration: 3000
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.isLoading = true;
    this.timeSlotService.searchByCriteria(this.searchCriteria, this.currentPage, this.pageSize)
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
      available: undefined,
      date: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: ''
    };
    this.currentPage = 0;
    this.loadTimeSlots();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.isSearchActive()) {
      this.onSearch();
    } else {
      this.loadTimeSlots();
    }
  }

  isSearchActive(): boolean {
    return Object.values(this.searchCriteria).some(val => 
      val !== undefined && val !== '' && (typeof val !== 'boolean' || val !== undefined)
    );
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TimeSlotForm, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTimeSlots();
      }
    });
  }

  openEditDialog(timeSlot: TimeSlot): void {
    const dialogRef = this.dialog.open(TimeSlotForm, {
      width: '600px',
      data: { mode: 'edit', timeSlot }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTimeSlots();
      }
    });
  }

  deleteTimeSlot(id: number): void {
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
        this.timeSlotService.deleteTimeSlot(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'Le créneau horaire a été supprimé.',
              'success'
            );
            this.loadTimeSlots();
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

  toggleAvailability(id: number, currentState: boolean): void {
    const operation = currentState 
      ? this.timeSlotService.bookTimeSlot(id)
      : this.timeSlotService.cancelTimeSlotBooking(id);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Créneau ${currentState ? 'réservé' : 'libéré'} avec succès`,
          'Fermer',
          { duration: 3000 }
        );
        this.loadTimeSlots();
      },
      error: () => {
        this.snackBar.open(
          `Erreur lors de ${currentState ? 'la réservation' : 'la libération'} du créneau`,
          'Fermer',
          { duration: 3000 }
        );
      }
    });
  }

}
