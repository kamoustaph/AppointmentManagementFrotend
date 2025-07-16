import { Specialty } from "./specialty.model";

export interface Doctor {
  id: number;
  licenseNumber: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  available: boolean;
  timeSlots?: TimeSlot[];
  specialties?: Specialty[];
}

export interface TimeSlot {
  id: number;
  // Ajoutez ici les autres propriétés de TimeSlot
}


export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}