export enum ERole {
  ADMIN = 'ADMIN',
  MEDECIN = 'MEDECIN',
  DOCTEUR = 'DOCTEUR',
  SECRETAIRE = 'SECRETAIRE',
  PATIENT   = 'PATIENT'
}

export interface Role {
  id: number;
  name: ERole;
}