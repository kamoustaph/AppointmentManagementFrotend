import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page, DoctorSpecialty } from '../models/doctor-specialty.model';
import { Doctor } from '../models/doctor.model';
import { Specialty } from '../models/specialty.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorSpecialtyService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8092/api';

  // Méthodes pour les médecins
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<{content: Doctor[]}>(`${this.baseUrl}/doctors`).pipe(
      map(response => response.content || [])
    );
  }

  // Méthodes pour les spécialités
  getAllSpecialties(): Observable<Specialty[]> {
    return this.http.get<{content: Specialty[]}>(`${this.baseUrl}/specialties`).pipe(
      map(response => response.content || [])
    );
  }

  // Méthodes pour les associations médecin-spécialité
  getAllDoctorSpecialties(page: number = 0, size: number = 5): Observable<Page<DoctorSpecialty>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<DoctorSpecialty>>(`${this.baseUrl}/doctor-specialties`, { params }).pipe(
      map(page => ({
        ...page,
        content: page.content.map(item => ({
          ...item,
          doctorName: item.doctor ? `${item.doctor.firstName} ${item.doctor.lastName}` : 'N/A',
          specialtyName: item.specialty ? item.specialty.name : 'N/A'
        }))
      })));
  }

  getDoctorSpecialtiesByDoctorId(doctorId: number, page: number = 0, size: number = 5): Observable<Page<DoctorSpecialty>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<DoctorSpecialty>>(`${this.baseUrl}/doctor-specialties/doctor/${doctorId}`, { params });
  }

  getDoctorSpecialtiesBySpecialtyId(specialtyId: number, page: number = 0, size: number = 5): Observable<Page<DoctorSpecialty>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<DoctorSpecialty>>(`${this.baseUrl}/doctor-specialties/specialty/${specialtyId}`, { params });
  }

  searchByCriteria(
    criteria: {
      doctorId?: number,
      specialtyId?: number
    },
    page: number = 0,
    size: number = 5
  ): Observable<Page<DoctorSpecialty>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (criteria.doctorId) params = params.set('doctorId', criteria.doctorId.toString());
    if (criteria.specialtyId) params = params.set('specialtyId', criteria.specialtyId.toString());

    return this.http.get<Page<DoctorSpecialty>>(`${this.baseUrl}/doctor-specialties/search`, { params });
  }

  getDoctorSpecialtyById(id: number): Observable<DoctorSpecialty> {
    return this.http.get<DoctorSpecialty>(`${this.baseUrl}/doctor-specialties/${id}`);
  }

  createDoctorSpecialty(doctorSpecialty: { doctorId: number, specialtyId: number }): Observable<DoctorSpecialty> {
    return this.http.post<DoctorSpecialty>(`${this.baseUrl}/doctor-specialties`, doctorSpecialty);
  }

  updateDoctorSpecialty(id: number, doctorSpecialty: { doctorId: number, specialtyId: number }): Observable<DoctorSpecialty> {
    return this.http.put<DoctorSpecialty>(`${this.baseUrl}/doctor-specialties/${id}`, doctorSpecialty);
  }

  deleteDoctorSpecialty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/doctor-specialties/${id}`);
  }

  existsByDoctorAndSpecialty(doctorId: number, specialtyId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('specialtyId', specialtyId.toString());
    
    return this.http.get<boolean>(`${this.baseUrl}/doctor-specialties/exists`, { params });
  }

  getTotalDoctorSpecialties(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/doctor-specialties/stats/total`);
  }
}