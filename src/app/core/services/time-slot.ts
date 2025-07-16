import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page, TimeSlot } from '../models/time-slot.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8092/api/time-slots';

  getAllTimeSlots(page: number = 0, size: number = 5): Observable<Page<TimeSlot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<TimeSlot>>(this.apiUrl, { params });
  }

  getAvailableTimeSlots(page: number = 0, size: number = 5): Observable<Page<TimeSlot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<TimeSlot>>(`${this.apiUrl}/available`, { params });
  }

  getTimeSlotsByDoctor(doctorId: number, page: number = 0, size: number = 5): Observable<Page<TimeSlot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<TimeSlot>>(`${this.apiUrl}/doctor/${doctorId}`, { params });
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

    return this.http.get<Page<TimeSlot>>(`${this.apiUrl}/search`, { params });
  }

  getTimeSlotById(id: number): Observable<TimeSlot> {
    return this.http.get<TimeSlot>(`${this.apiUrl}/${id}`);
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