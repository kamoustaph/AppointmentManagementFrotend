import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of, throwError } from 'rxjs';
import {
  Appointment,
  AppointmentRequest,
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
    private timeSlotsCache: TimeSlot[] = []; 
    private patientsCache: Patient[] = [];

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8092/api/appointments';

    getAllAppointments(
        page: number = 0,
        size: number = 5
    ): Observable<Page<Appointment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<Page<Appointment>>(this.apiUrl, { params }).pipe(
            mergeMap(page => {
                // Récupérer tous les IDs nécessaires
                const patientIds = page.content
                    .map(a => a.patientId)
                    .filter((id): id is number => id !== undefined && id !== null);
                
                const timeSlotIds = page.content
                    .map(a => a.timeSlotId)
                    .filter((id): id is number => id !== undefined && id !== null);

                // Charger tous les patients et créneaux nécessaires
                const patients$ = patientIds.length > 0 
                    ? this.getPatientsByIds(Array.from(new Set(patientIds)))
                    : of([] as Patient[]);
                
                const timeSlots$ = timeSlotIds.length > 0
                    ? this.getTimeSlotsByIds(Array.from(new Set(timeSlotIds)))
                    : of([] as TimeSlot[]);

                return forkJoin([patients$, timeSlots$]).pipe(
                    map(([patients, timeSlots]) => {
                        // Mapper les rendez-vous avec les données complètes
                        const content = page.content.map(appointment => {
                            const patient = patients.find((p: Patient) => p.id === appointment.patientId);
                            const timeSlot = timeSlots.find((t: TimeSlot) => t.id === appointment.timeSlotId);
                            const specialty = appointment.specialtyId ? 
                                { id: appointment.specialtyId, name: 'Chargement...' } : null;

                            return {
                                ...appointment,
                                patient: patient || { 
                                    id: appointment.patientId || 0, 
                                    firstName: 'Inconnu', 
                                    lastName: '',
                                    email: '',
                                    phoneNumber: '',
                                    dateOfBirth: new Date(),
                                    gender: 'OTHER'
                                },
                                timeSlot: timeSlot || { 
                                    id: appointment.timeSlotId || 0, 
                                    startTime: '--:--', 
                                    endTime: '--:--',
                                    date: '',
                                    available: true
                                },
                                specialty: specialty || { id: 0, name: 'Inconnue' }
                            } as Appointment;
                        });

                        return {
                            ...page,
                            content
                        };
                    })
                );
            })
        );
    }

    private getPatientsByIds(ids: number[]): Observable<Patient[]> {
        if (!ids || ids.length === 0) {
            return of([]);
        }
        const params = new HttpParams().set('ids', ids.join(','));
        return this.http.get<Patient[]>(`${this.apiUrl}/patients/batch`, { params });
    }

    private getTimeSlotsByIds(ids: number[]): Observable<TimeSlot[]> {
        if (!ids || ids.length === 0) {
            return of([]);
        }
        const params = new HttpParams().set('ids', ids.join(','));
        return this.http.get<TimeSlot[]>(`${this.apiUrl}/time-slots/batch`, { params });
    }


    getTotalAppointmentes(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total`);
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
        // Vérification des champs obligatoires
        const patientId = appointment.patient?.id ?? appointment.patientId;
        const specialtyId = appointment.specialty?.id ?? appointment.specialtyId;
        const timeSlotId = appointment.timeSlot?.id ?? appointment.timeSlotId;

        if (!patientId || !specialtyId || !timeSlotId) {
            return throwError(() => new Error('Tous les champs obligatoires doivent être fournis'));
        }

        const request: AppointmentRequest = {
            date: this.formatDate(new Date(appointment.date)),
            status: appointment.status,
            patientId: patientId,
            specialtyId: specialtyId,
            timeSlotId: timeSlotId
        };

        return this.http.post<Appointment>(`${this.apiUrl}`, request);
    }

    updateAppointment(
        id: number,
        appointment: Appointment
    ): Observable<Appointment> {
        const payload = {
            date: appointment.date,
            status: appointment.status,
            patient: { id: appointment.patientId },
            specialty: { id: appointment.specialtyId },
            timeSlot: { id: appointment.timeSlotId }
        };

        return this.http.put<Appointment>(`${this.apiUrl}/${id}`, payload);
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