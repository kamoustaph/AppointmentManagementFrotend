// auth-response.model.ts
export interface AuthResponse {
  token: string | { bearer: string };
  user: {
    id: number;
    username: string;
    name: string;
    phone?: string;
    roles: string[]; // Le backend envoie les rôles comme string[]
    actif?: boolean;
    role?: string;   // Le backend envoie peut-être juste le nom du rôle
    deviceToken?: string;
  };
  message?: string;
}