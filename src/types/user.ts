export type MinistryPosition = 
  | 'Président'
  | 'Pasteur' 
  | 'Modérateur' 
  | 'Chantre / Intercesseur' 
  | 'Leader de Jeunesse' 
  | 'Evangéliste' 
  | 'Membre'
  | 'Administrateur Principal'
  | 'Éditeur Média';

export type UserRole = 'user' | 'admin' | 'moderator' | 'superadmin' | 'principal_admin' | 'president' | 'publisher';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  ministryPosition: MinistryPosition;
  city: string;
  country: string;
  role: UserRole;
  memberId: string; // Formatted digital card ID e.g. "MGJ-2026-8941"
  createdAt: string;
  avatarUrl?: string;
  profilePhoto?: string;
  sector?: string; // Secteur MGJ (ex: Secteur Bel-Air, Secteur Kasenga, Secteur Kinshasa...)
  idCardNumber?: string; // Numéro d'Identité Nationale / Carte d'Identité
}
