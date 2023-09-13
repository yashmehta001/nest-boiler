import { IAdminRepository } from '../../repository/admin.repository';

export const mockAdminRepository = (): IAdminRepository => ({
  getByEmail: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
});
