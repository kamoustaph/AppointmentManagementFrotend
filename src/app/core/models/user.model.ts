import { Role } from "./role.model";
export interface User {
  id: any;
  username: string;
  name: string;
  roles: string[];
  actif: boolean;
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