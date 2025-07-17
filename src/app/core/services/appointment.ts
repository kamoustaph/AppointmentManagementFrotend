// appointment.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Appointment,
  AppointmentStatus,
  Page,
} from '../models/appointment.model';
import { Specialty } from '../models/specialty.model';
import { Patient } from '../models/patient.model';
import { TimeSlot } from '../models/time-slot.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8092/api/appointments';

  getAllAppointments(
    page: number = 0,
    size: number = 5
  ): Observable<Page<Appointment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Appointment>>(this.apiUrl, { params });
  }
  getAllPatients(
    page: number = 0,
    size: number = 100
  ): Observable<Page<Patient>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Patient>>('http://localhost:8092/api/patients', {
      params,
    });
  }

  getAllSpecialties(
    page: number = 0,
    size: number = 100
  ): Observable<Page<Specialty>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Specialty>>(
      'http://localhost:8092/api/specialties',
      { params }
    );
  }
getAvailableTimeSlots(date: Date, specialtyId: number): Observable<TimeSlot[]> {
  const formattedDate = this.formatDate(date);

  const params = new HttpParams()
    .set('date', formattedDate)
    .set('specialtyId', specialtyId.toString())
    .set('page', '0')
    .set('size', '100');

  return this.http.get<Page<TimeSlot>>(
    'http://localhost:8092/api/time-slots/available',
    { params }
  ).pipe(
    map(res => res.content)
  );
}


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getAppointmentsByStatus(
    status: AppointmentStatus,
    page: number = 0,
    size: number = 5
  ): Observable<Page<Appointment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Appointment>>(`${this.apiUrl}/status/${status}`, {
      params,
    });
  }

  getAppointmentsByPatientId(
    patientId: number,
    page: number = 0,
    size: number = 5
  ): Observable<Page<Appointment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Appointment>>(
      `${this.apiUrl}/patient/${patientId}`,
      { params }
    );
  }

  getAppointmentsByDate(
    date: string,
    page: number = 0,
    size: number = 5
  ): Observable<Page<Appointment>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Appointment>>(`${this.apiUrl}/date/${date}`, {
      params,
    });
  }

  searchAppointments(
    criteria: {
      patientId?: number;
      specialtyId?: number;
      timeSlotId?: number;
      status?: AppointmentStatus;
      startDate?: string;
      endDate?: string;
    },
    page: number = 0,
    size: number = 5
  ): Observable<Page<Appointment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (criteria.patientId)
      params = params.set('patientId', criteria.patientId.toString());
    if (criteria.specialtyId)
      params = params.set('specialtyId', criteria.specialtyId.toString());
    if (criteria.timeSlotId)
      params = params.set('timeSlotId', criteria.timeSlotId.toString());
    if (criteria.status) params = params.set('status', criteria.status);
    if (criteria.startDate)
      params = params.set('startDate', criteria.startDate);
    if (criteria.endDate) params = params.set('endDate', criteria.endDate);

    return this.http.get<Page<Appointment>>(`${this.apiUrl}/search`, {
      params,
    });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(
    id: number,
    appointment: Appointment
  ): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  confirmAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/confirm`, {});
  }

  cancelAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  completeAppointment(id: number): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/complete`, {});
  }

  getTotalAppointments(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total`);
  }
}
