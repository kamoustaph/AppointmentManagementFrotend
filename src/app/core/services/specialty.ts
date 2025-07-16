// src/app/core/services/specialty.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page, Specialty } from '../models/specialty.model';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8092/api/specialties';

  getAllSpecialties(page: number = 0, size: number = 5): Observable<Page<Specialty>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Specialty>>(this.apiUrl, { params });
  }

  searchByName(name: string, page: number = 0, size: number = 5): Observable<Page<Specialty>> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Specialty>>(`${this.apiUrl}/search/name`, { params });
  }

  searchByDescription(description: string, page: number = 0, size: number = 5): Observable<Page<Specialty>> {
    const params = new HttpParams()
      .set('description', description)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<Specialty>>(`${this.apiUrl}/search/description`, { params });
  }

  searchByCriteria(
    criteria: {
      name?: string,
      description?: string
    },
    page: number = 0,
    size: number = 5
  ): Observable<Page<Specialty>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (criteria.name) params = params.set('name', criteria.name);
    if (criteria.description) params = params.set('description', criteria.description);

    return this.http.get<Page<Specialty>>(`${this.apiUrl}/search/criteria`, { params });
  }

  getTotalSpecialties(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total`);
  }

  getSpecialtyById(id: number): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.apiUrl}/${id}`);
  }

  createSpecialty(specialty: Specialty): Observable<Specialty> {
    return this.http.post<Specialty>(this.apiUrl, specialty);
  }

  updateSpecialty(id: number, specialty: Specialty): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.apiUrl}/${id}`, specialty);
  }

  deleteSpecialty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}