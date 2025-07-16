// Format "HH:mm" (ex: "09:00")
export interface TimeSlot {
  id?: number;
  available: boolean;
  slotDate: Date; 
  startTime: string;
  endTime: string;
  doctorId: number;
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