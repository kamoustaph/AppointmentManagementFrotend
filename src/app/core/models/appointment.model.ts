export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED'
}

export interface AppointmentRequest {
  date: string;
  status: AppointmentStatus;
  patientId: number;
  specialtyId: number;
  timeSlotId: number;
}

export interface Appointment {
  id?: number;
  date: Date | string;
  status: AppointmentStatus;
  patientId?: number;
  patient?: {
    id: number;
    lastName: string;
    firstName: string;
  };
  specialtyId?: number;
  specialty?: {
    id: number;
    name: string;
  };
  timeSlotId?: number;
  timeSlot?: {
    id: number;
    startTime: string;
    endTime: string;
  };
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}