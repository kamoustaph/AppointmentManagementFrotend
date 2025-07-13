export interface Patient {
  id?: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
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