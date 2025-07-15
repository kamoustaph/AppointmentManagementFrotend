import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page, Doctor } from '../models/doctor.model';
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8092/api/doctors';

  getAllDoctors(page: number = 0, size: number = 5): Observable<Page<Doctor>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Doctor>>(this.apiUrl, { params });
  }

  searchByFullName(name: string, page: number = 0, size: number = 5): Observable<Page<Doctor>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Doctor>>(`${this.apiUrl}/search/name`, { params });
  }

  searchByLicenseNumber(licenseNumber: string, page: number = 0, size: number = 5): Observable<Page<Doctor>> {
    const params = new HttpParams()
      .set('licenseNumber', licenseNumber)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Doctor>>(`${this.apiUrl}/search/license`, { params });
  }

  searchByEmail(email: string, page: number = 0, size: number = 5): Observable<Page<Doctor>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Doctor>>(`${this.apiUrl}/search/email`, { params });
  }

  searchByCriteria(
    criteria: {
      lastName?: string,
      firstName?: string,
      email?: string,
      licenseNumber?: string,
      phoneNumber?: string
    },
    page: number = 0,
    size: number = 5
  ): Observable<Page<Doctor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (criteria.lastName) params = params.set('lastName', criteria.lastName);
    if (criteria.firstName) params = params.set('firstName', criteria.firstName);
    if (criteria.email) params = params.set('email', criteria.email);
    if (criteria.licenseNumber) params = params.set('licenseNumber', criteria.licenseNumber);
    if (criteria.phoneNumber) params = params.set('phoneNumber', criteria.phoneNumber);

    return this.http.get<Page<Doctor>>(`${this.apiUrl}/search`, { params });
  }

  getTotalDoctors(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}