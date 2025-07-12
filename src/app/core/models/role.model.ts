export enum ERole {
  ADMIN = 'ROLE_ADMIN',
  MEDECIN = 'ROLE_MEDECIN',
  DOCTEUR = 'ROLE_DOCTEUR',
  SECRETAIRE = 'ROLE_SECRETAIRE',
  PATIENT   = 'ROLE_PATIENT'
}

export interface Role {
  id: number;
  name: ERole;
}