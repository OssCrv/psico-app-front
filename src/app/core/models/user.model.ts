export type UserRole = 'ADMIN' | 'TERAPEUTA' | 'PACIENTE' | 'USUARIO';

export interface User {
  id?: number | string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  docType?: string;
  document?: string;
  professionalCard?: boolean;
  email?: string;
  telephone?: string;
  isActive?: boolean;
  role?: UserRole | string;
  [key: string]: unknown;
}

export interface CreateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  docType: string;
  document: string;
  professionalCard: boolean;
  email: string;
  telephone: string;
  isActive: boolean;
  password: string;
  role: UserRole;
}
