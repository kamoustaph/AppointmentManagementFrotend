export interface TimeSlot {
  id?: number;
  available: boolean;
  slotDate: Date; 
  startTime: string;
  endTime: string;
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