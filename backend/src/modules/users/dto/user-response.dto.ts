import { Role } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  phone?: string;
  role: Role;
  specialty?: string;
  bio?: string;
  avatarUrl?: string;
  googleSyncToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
