import { IAdminService } from '../../services/admin.service';

export const mockAdminService = (): IAdminService => ({
  createAdmin: jest.fn(),
  loginAdmin: jest.fn(),
  profile: jest.fn(),
});
