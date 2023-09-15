import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../../admin.controller';
import { AdminService } from '../../services/admin.service';
import { mockAdminService } from '../mocks';
import {
  invalidEmailInputCreate,
  invalidInputLogin,
  adminOutputWithToken,
  validInputCreate,
  validInputLogin,
  adminOutput,
  adminProfileInput,
  invalidAdmindminProfileInput,
} from '../constants';

describe('User Controller', () => {
  let adminService;
  let adminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminController,
        {
          provide: AdminService,
          useFactory: mockAdminService,
        },
      ],
    }).compile();
    adminService = module.get<AdminService>(AdminService);
    adminController = module.get<AdminController>(AdminController);
  });
  it('UserController should be defined', () => {
    expect(adminController).toBeDefined();
  });

  describe('User Create', () => {
    it('Valid User details should return valid response', async () => {
      adminService.createAdmin.mockReturnValue(adminOutputWithToken);
      const user = await adminController.signUp(validInputCreate);
      expect(user).toEqual(adminOutputWithToken);
    });
    it('Invalid firstName should throw Validation Error', async () => {
      try {
        await adminController.signUp(invalidEmailInputCreate);
        fail('ReferenceError is not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
      }
    });
  });

  describe('login Create', () => {
    it('Valid User details should return valid response', async () => {
      adminService.loginAdmin.mockReturnValue(adminOutputWithToken);
      const user = await adminController.login(validInputLogin);
      expect(user).toEqual(adminOutputWithToken);
    });
    it('Invalid email should throw Validation Error', async () => {
      try {
        await adminController.login(invalidInputLogin);
        fail('ReferenceError is not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
      }
    });
  });

  describe('Admin Pofile', () => {
    it('Valid User Header should return valid response', async () => {
      adminService.profile.mockReturnValue(adminOutput);
      const user = await adminController.profile(adminProfileInput);
      expect(user).toEqual(adminOutput);
    });
    it('Invalid email should throw Validation Error', async () => {
      try {
        await adminController.profile(invalidAdmindminProfileInput);
        fail('ReferenceError is not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError);
      }
    });
  });
});
