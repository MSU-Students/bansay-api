import { UserRole } from 'src/user/interfaces/user-role.enum';

export interface JwtPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  iat?: number; // issued at
  exp?: number; // expiration
}
