import { Specialty } from "./specialty.model";
import { TimeSlot } from "./time-slot.model";

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


export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}