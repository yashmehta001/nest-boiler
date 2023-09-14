import { Test, TestingModule } from '@nestjs/testing';
import { AdminRepository } from '../../repository/admin.repository';
import { AdminService } from '../../services/admin.service';
import { HashService } from '../../../utils/hash/hash.service';
import { LoggerService } from '../../../utils/logger/WinstonLogger';
import { TokenService } from '../../../utils/token/services';
import { mockAdminRepository } from '../mocks/admin.repository.mock';
import { UserType } from '../../../utils/token/types';
import { AdminLoginReqDto, AdminProfileReqDto } from '../../dto';
import { NotFoundException, authFailedException } from '../../errors';
import { mockHashService, mockTokenService } from '../mocks';

describe('AdminService', () => {
  let adminService: AdminService;
  let adminRepository;
  let hashService;
  let tokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        LoggerService,
        {
          provide: HashService,
          useFactory: mockHashService,
        },
        {
          provide: TokenService,
          useFactory: mockTokenService,
        },
        {
          provide: AdminRepository,
          useFactory: mockAdminRepository,
        },
      ],
    }).compile();
    adminService = module.get<AdminService>(AdminService);
    adminRepository = module.get<AdminRepository>(AdminRepository);
    hashService = module.get<HashService>(HashService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('adminService should be defined', () => {
    expect(adminService).toBeDefined();
  });

  describe('Login Test', () => {
    
    it('Get User Info and token when entering valid Email and Password', async () => {
      const body: AdminLoginReqDto = {
        email: 'john@doe.com',
        password: '123456',
      };
      const expected = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        firstName: 'john',
        lastName: 'doe',
        email: 'john@doe.com',
        password:
          '$2b$10$4Dz7cd/nTzDm2Dm2vRbYs.SQUtRrV2pE/Z7L82XataOOJklLPiM.2',
        createdAt: '2023-09-13T01:41:57.449Z',
        updatedAt: '2023-09-13T01:41:57.449Z',
        deletedAt: null,
      };
      const token = 'token';
      adminRepository.getByEmail.mockReturnValue(expected);
      hashService.compare.mockReturnValue(true);
      tokenService.token.mockReturnValue(token);
      const admin = await adminService.loginAdmin(body);
      expect(tokenService.token).toHaveBeenCalled();
      expect(admin).toEqual({
        token: `Bearer ${token}`,
        user: { ...expected },
      });
    });
    
    it('Get User Info and Token when entering valid Email and Invalid Password', async () => {
      const body: AdminLoginReqDto = {
        email: 'john@doe.com',
        password: '123456',
      };
      const expected = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        firstName: 'john',
        lastName: 'doe',
        email: 'john@doe.com',
        password:
          '$2b$10$4Dz7cd/nTzDm2Dm2vRbYs.SQUtRrV2pE/Z7L82XataOOJklLPiM.2',
        createdAt: '2023-09-13T01:41:57.449Z',
        updatedAt: '2023-09-13T01:41:57.449Z',
        deletedAt: null,
      };
      adminRepository.getByEmail.mockReturnValue(expected);
      hashService.compare.mockReturnValue(false);
      try {
        await adminService.loginAdmin(body);
      } catch (error) {
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(authFailedException);
      }
    });
  });

  describe('Profile Test', () => {
    it('Get Profile where ID exists Should Return Profile Object', async () => {
      const body: AdminProfileReqDto = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        userType: UserType.ADMIN,
        email: 'john@doe.com',
        iat: 1234,
        exp: 1234,
      };
      const expected = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        firstName: 'john',
        lastName: 'doe',
        email: 'john@doe.com',
        password:
          '$2b$10$4Dz7cd/nTzDm2Dm2vRbYs.SQUtRrV2pE/Z7L82XataOOJklLPiM.2',
        createdAt: '2023-09-13T01:41:57.449Z',
        updatedAt: '2023-09-13T01:41:57.449Z',
        deletedAt: null,
      };
      adminRepository.getById.mockReturnValue(expected);
      const user = await adminService.profile(body);
      expect(user).toEqual(expected);
    });
    it('Get Profile where ID Doesnt Exists Should throw NotFoundException ', async () => {
      const body: AdminProfileReqDto = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        userType: UserType.ADMIN,
        email: 'john@doe.com',
        iat: 1234,
        exp: 1234,
      };

      adminRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await adminService.profile(body);
        fail('NotFoundException not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
