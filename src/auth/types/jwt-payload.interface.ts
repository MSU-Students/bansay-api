import { UserRole } from '@bansay/user/interfaces/user-role.enum';

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  iat?: number; // issued at
  exp?: number; // expiration
}
