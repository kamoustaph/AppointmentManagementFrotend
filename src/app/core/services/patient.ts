import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page, Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8092/api/patients';

  getAllPatients(page: number = 0, size: number = 10): Observable<Page<Patient>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Patient>>(this.apiUrl, { params });
  }

  searchByFullName(name: string, page: number = 0, size: number = 10): Observable<Page<Patient>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Patient>>(`${this.apiUrl}/search/name`, { params });
  }

  searchByPhoneNumber(phoneNumber: string, page: number = 0, size: number = 10): Observable<Page<Patient>> {
    const params = new HttpParams()
      .set('phoneNumber', phoneNumber)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Patient>>(`${this.apiUrl}/search/phone`, { params });
  }

  searchByEmail(email: string, page: number = 0, size: number = 10): Observable<Page<Patient>> {
    const params = new HttpParams()
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Patient>>(`${this.apiUrl}/search/email`, { params });
  }

  searchByCriteria(
    criteria: {
      lastName?: string,
      firstName?: string,
      email?: string,
      phoneNumber?: string
    },
    page: number = 0,
    size: number = 10
  ): Observable<Page<Patient>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (criteria.lastName) params = params.set('lastName', criteria.lastName);
    if (criteria.firstName) params = params.set('firstName', criteria.firstName);
    if (criteria.email) params = params.set('email', criteria.email);
    if (criteria.phoneNumber) params = params.set('phoneNumber', criteria.phoneNumber);

    return this.http.get<Page<Patient>>(`${this.apiUrl}/search`, { params });
  }

  getTotalPatients(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}