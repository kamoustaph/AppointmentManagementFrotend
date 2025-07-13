import { Role } from "./role.model";

export interface User {
  id: number;
  username: string;
  name: string;
  phone: string;
  password?: string;
  roles: Set<Role>; 
  actif: boolean;
  role: Role; 
  deviceToken?: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration extends Omit<User, 'id' | 'roles' | 'actif'> {
  password: string;
  role: Role;
}

export type { Role };