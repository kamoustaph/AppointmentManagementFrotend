import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page, TimeSlot } from '../models/time-slot.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8092/api/time-slots';

  private formatTime(time: string): string {
    if (!time) return '';

    // Cas 1: Format "12,0" ou "12,30" (virgule comme séparateur)
    if (time.includes(',')) {
      const [hours, minutes] = time.split(',');
      const normalizedMinutes = minutes.length === 1 ? `${minutes}0` : minutes;
      return `${hours}h${normalizedMinutes}min`;
    }
    
    // Cas 2: Format "12:00" (deux-points comme séparateur)
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${hours}h${minutes}min`;
    }

    // Cas 3: Format "12h30" (manque 'min' à la fin)
    if (time.includes('h') && !time.endsWith('min')) {
      return `${time}min`;
    }

    // Cas 4: Format déjà correct "12h30min" ou autre format non reconnu
    return time;
  }

  private formatTimeSlot(timeSlot: TimeSlot): TimeSlot {
    return {
      ...timeSlot,
      startTime: this.formatTime(timeSlot.startTime),
      endTime: this.formatTime(timeSlot.endTime)
    };
  }

  getAllTimeSlots(page: number = 0, size: number = 5): Observable<Page<TimeSlot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<TimeSlot>>(this.apiUrl, { params }).pipe(
      map(page => ({
        ...page,
        content: page.content.map(slot => this.formatTimeSlot(slot))
      }))
    );
  }
  getAvailableTimeSlots(page: number = 0, size: number = 5): Observable<Page<TimeSlot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<TimeSlot>>(`${this.apiUrl}/available`, { params }).pipe(
      map(page => ({
        ...page,
        content: page.content.map(slot => this.formatTimeSlot(slot))
      }))
    );
  }

  getTimeSlotsByDoctor(doctorId: number, page: number = 0, size: number = 5): Observable<Page<TimeSlot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<TimeSlot>>(`${this.apiUrl}/doctor/${doctorId}`, { params }).pipe(
      map(page => ({
        ...page,
        content: page.content.map(slot => this.formatTimeSlot(slot))
      }))
    );
  }

  searchByCriteria(
    criteria: {
      available?: boolean,
      date?: string,
      startDate?: string,
      endDate?: string,
      startTime?: string,
      endTime?: string
    },
    page: number = 0,
    size: number = 5
  ): Observable<Page<TimeSlot>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (criteria.available !== undefined) params = params.set('available', criteria.available.toString());
    if (criteria.date) params = params.set('date', criteria.date);
    if (criteria.startDate) params = params.set('startDate', criteria.startDate);
    if (criteria.endDate) params = params.set('endDate', criteria.endDate);
    if (criteria.startTime) params = params.set('startTime', criteria.startTime);
    if (criteria.endTime) params = params.set('endTime', criteria.endTime);

    return this.http.get<Page<TimeSlot>>(`${this.apiUrl}/search`, { params }).pipe(
      map(page => ({
        ...page,
        content: page.content.map(slot => this.formatTimeSlot(slot))
      }))
    );
  }

  getTimeSlotById(id: number): Observable<TimeSlot> {
    return this.http.get<TimeSlot>(`${this.apiUrl}/${id}`).pipe(
      map(slot => this.formatTimeSlot(slot))
    );
  }

  createTimeSlot(timeSlot: TimeSlot): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(this.apiUrl, timeSlot);
  }

  updateTimeSlot(id: number, timeSlot: TimeSlot): Observable<TimeSlot> {
    return this.http.put<TimeSlot>(`${this.apiUrl}/${id}`, timeSlot);
  }

  deleteTimeSlot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  bookTimeSlot(id: number): Observable<TimeSlot> {
    return this.http.put<TimeSlot>(`${this.apiUrl}/${id}/book`, {});
  }

  cancelTimeSlotBooking(id: number): Observable<TimeSlot> {
    return this.http.put<TimeSlot>(`${this.apiUrl}/${id}/cancel-booking`, {});
  }
}