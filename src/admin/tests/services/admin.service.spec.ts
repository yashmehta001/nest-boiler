import { Test, TestingModule } from '@nestjs/testing';
import { AdminRepository } from '../../repository/admin.repository';
import { AdminService } from '../../services/admin.service';
import { HashService } from '../../../utils/hash/hash.service';
import { LoggerService } from '../../../utils/logger/WinstonLogger';
import { TokenService } from '../../../utils/token/services';
import { mockAdminRepository } from '../mocks/admin.repository.mock';
import {
  NotFoundException,
  authFailedException,
  emailExistsException,
} from '../../errors';
import { mockHashService, mockTokenService } from '../mocks';
import {
  adminOutput,
  adminOutputWithToken,
  adminProfileInput,
  createAdminInput,
  loginAdminInput,
  token,
} from '../constants';

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

  describe('Create Admin Test', () => {
    it('Get User Info and token when entering valid FirstName LastName Email and Password', async () => {
      hashService.hash.mockReturnValue(adminOutput.password);
      tokenService.token.mockReturnValue(token);
      adminRepository.save.mockReturnValue(adminOutput);
      const admin = await adminService.createAdmin(createAdminInput);

      expect(tokenService.token).toHaveBeenCalled();
      expect(admin).toEqual(adminOutputWithToken);
    });

    it('Throw emailExistsException when entering dublicate email', async () => {
      const duplicateKeyError = { code: '23505' };
      adminRepository.save.mockRejectedValue(duplicateKeyError);
      try {
        await adminService.createAdmin(createAdminInput);
      } catch (error) {
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(emailExistsException);
      }
    });
  });

  describe('Login Admin Test', () => {
    it('Get User Info and token when entering valid Email and Password', async () => {
      adminRepository.getByEmail.mockReturnValue(adminOutput);
      hashService.compare.mockReturnValue(true);
      tokenService.token.mockReturnValue(token);
      const admin = await adminService.loginAdmin(loginAdminInput);
      expect(tokenService.token).toHaveBeenCalled();
      expect(admin).toEqual(adminOutputWithToken);
    });

    it('Throw authFailedException when entering valid Email and Invalid Password', async () => {
      adminRepository.getByEmail.mockReturnValue(adminOutput);
      hashService.compare.mockReturnValue(false);
      try {
        await adminService.loginAdmin(loginAdminInput);
      } catch (error) {
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(authFailedException);
      }
    });

    it('Throw authFailedException when entering Invalid Email and Password', async () => {
      adminRepository.getByEmail.mockRejectedValue(new NotFoundException());
      try {
        await adminService.loginAdmin(loginAdminInput);
      } catch (error) {
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(authFailedException);
      }
    });
  });

  describe('Profile Admin Test', () => {
    it('Get Profile where ID exists Should Return Profile Object', async () => {
      adminRepository.getById.mockReturnValue(adminOutput);
      const user = await adminService.profile(adminProfileInput);
      expect(user).toEqual(adminOutput);
    });
    it('Throw NotFoundException When ID Doesnt Exists', async () => {
      adminRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await adminService.profile(adminProfileInput);
        fail('NotFoundException not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('Seed-data Admin', () => {
    it('Should Seed database when entering valid seed Data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../seed-data/admin-user.seed-data').AdminUsersSeedData = [
        {
          firstName: 'john',
          lastName: 'Snow',
          email: 'john@doe.com',
          password: '123456',
        },
      ];

      hashService.hash.mockReturnValue(adminOutput.password);
      adminRepository.save.mockReturnValue(adminOutput);
      await adminService.seedAdminUserGroup();

      expect(adminRepository.save).toHaveBeenCalledTimes(1);
      expect(hashService.hash).toHaveBeenCalledTimes(1);
    });
    it('Should Not Seed database when entering Invalid seed Data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../seed-data/admin-user.seed-data').AdminUsersSeedData = [{}];
      await adminService.seedAdminUserGroup();

      expect(adminRepository.save).not.toHaveBeenCalled();
      expect(hashService.hash).not.toHaveBeenCalled();
    });
  });
});
