import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../repository/users.repository';
import { UserService } from '../../services/users.service';
import { HashService } from '../../../utils/hash/hash.service';
import { LoggerService } from '../../../utils/logger/WinstonLogger';
import { TokenService } from '../../../utils/token/services';
import { mockUsersRepository } from '../mocks/users.repository.mock';
import { UserType } from '../../../utils/token/types';
import {
  UserCreateReqDto,
  UserLoginReqDto,
  UserProfileReqDto,
} from '../../dto';
import {
  NotFoundException,
  authFailedException,
  emailExistsException,
} from '../../errors';
import { mockHashService, mockTokenService } from '../mocks';

describe('UserService', () => {
  let userService: UserService;
  let userRepository;
  let hashService;
  let tokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
          provide: UserRepository,
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    hashService = module.get<HashService>(HashService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('UsersService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Create Users Test', () => {
    it('Get User Info and token when entering valid FirstName LastName Email and Password', async () => {
      const body: UserCreateReqDto = {
        firstName: 'john',
        lastName: 'doe',
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
      hashService.hash.mockReturnValue(expected.password);
      tokenService.token.mockReturnValue(token);
      userRepository.save.mockReturnValue(expected);
      const user = await userService.createUser(body);

      expect(tokenService.token).toHaveBeenCalled();
      expect(user).toEqual({
        token: `Bearer ${token}`,
        user: { ...expected },
      });
    });

    it('Throw emailExistsException when entering dublicate email', async () => {
      const body: UserCreateReqDto = {
        firstName: 'john',
        lastName: 'doe',
        email: 'john@doe.com',
        password: '123456',
      };
      const duplicateKeyError = { code: '23505' };
      userRepository.save.mockRejectedValue(duplicateKeyError);
      try {
        await userService.createUser(body);
      } catch (error) {
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(emailExistsException);
      }
    });
  });

  describe('Login User Test', () => {
    it('Get User Info and token when entering valid Email and Password', async () => {
      const body: UserLoginReqDto = {
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
      userRepository.getByEmail.mockReturnValue(expected);
      hashService.compare.mockReturnValue(true);
      tokenService.token.mockReturnValue(token);
      const User = await userService.loginUser(body);
      expect(tokenService.token).toHaveBeenCalled();
      expect(User).toEqual({
        token: `Bearer ${token}`,
        user: { ...expected },
      });
    });

    it('Throw authFailedException when entering valid Email and Invalid Password', async () => {
      const body: UserLoginReqDto = {
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
      userRepository.getByEmail.mockReturnValue(expected);
      hashService.compare.mockReturnValue(false);
      try {
        await userService.loginUser(body);
      } catch (error) {
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(authFailedException);
      }
    });

    it('Throw authFailedException when entering Invalid Email and Password', async () => {
      const body: UserLoginReqDto = {
        email: 'john@doe.com',
        password: '123456',
      };
      userRepository.getByEmail.mockRejectedValue(new NotFoundException());
      try {
        await userService.loginUser(body);
      } catch (error) {
        expect(hashService.compare).not.toHaveBeenCalled();
        expect(tokenService.token).not.toHaveBeenCalled();
        expect(error).toBeInstanceOf(authFailedException);
      }
    });
  });

  describe('Profile User Test', () => {
    it('Get Profile where ID exists Should Return Profile Object', async () => {
      const body: UserProfileReqDto = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        userType: UserType.USER,
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
      userRepository.getById.mockReturnValue(expected);
      const user = await userService.profile(body);
      expect(user).toEqual(expected);
    });
    it('Throw NotFoundException When ID Doesnt Exists', async () => {
      const body: UserProfileReqDto = {
        id: '929270f8-f62e-4580-8533-10d473ce520a',
        userType: UserType.USER,
        email: 'john@doe.com',
        iat: 1234,
        exp: 1234,
      };

      userRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await userService.profile(body);
        fail('NotFoundException not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
