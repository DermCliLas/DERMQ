import { AuthService } from './auth.service';
import { ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService - Privilege Escalation Protection', () => {
  let service: AuthService;
  let mockPrisma: any;
  let mockJwt: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    mockJwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn(),
    };
    service = new AuthService(mockPrisma, mockJwt);
  });

  it('should enforce Role.PATIENT even if client tries to send ADMIN role', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    let savedRole: any;
    mockPrisma.user.create.mockImplementation(async ({ data }: any) => {
      savedRole = data.role;
      return {
        id: 'new-user',
        ...data,
      };
    });

    const maliciousDto: any = {
      email: 'hacker@test.com',
      password: 'password123',
      firstName: 'Evil',
      lastName: 'Admin',
      role: 'ADMIN', // Attacker attempts to register as ADMIN
      specialty: 'Dermatologist',
    };

    await service.register(maliciousDto);

    // The saved role MUST be strictly PATIENT, completely ignoring client input
    expect(savedRole).toBe(Role.PATIENT);
    expect(savedRole).not.toBe('ADMIN');
  });

  it('should reject registration if user already exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-id' });

    await expect(
      service.register({
        email: 'exists@test.com',
        password: 'password123',
        firstName: 'Carlos',
        lastName: 'Test',
      } as any),
    ).rejects.toThrow(ConflictException);
  });
});
