import { Doctor } from "./doctor.model";
import { Specialty } from "./specialty.model";

export interface DoctorSpecialty {
  id?: number;
 doctor: Doctor; 
  specialty: Specialty; 
  doctorName?: string;  
  specialtyName?: string;
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