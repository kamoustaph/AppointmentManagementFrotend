export interface AuthResponse {
  token: string | { bearer: string };
  user: {
    id: number;
    username: string;
    name: string;
    phone?: string;
    roles: string[]; 
    actif?: boolean;
    role?: string;   
    deviceToken?: string;
  };
  message?: string;
}