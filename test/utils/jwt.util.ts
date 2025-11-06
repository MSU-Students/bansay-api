import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { UserRole } from 'src/user/interfaces/user-role.enum';

const TEST_SECRET = 'TEMP_SECRET';

export function generateTestToken(payload: JwtPayload): string {
  const jwtService = new JwtService({
    secret: TEST_SECRET,
  });

  const token = jwtService.sign(payload);
  return token;
}

export const DUMMY_USER_PAYLOAD = {
  userId: '1',
  email: 'test@example.com',
  roles: [UserRole.ADMIN],
};
