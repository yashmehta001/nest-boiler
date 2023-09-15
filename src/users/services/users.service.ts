import { Inject, Injectable } from '@nestjs/common';
import { UserCreateReqDto, UserLoginReqDto, UserProfileReqDto } from '../dto';
import { UserRepository } from '../repository/users.repository';
import { TokenService } from '../../utils/token/services';
import { HashService } from '../../utils/hash/hash.service';
import { UserType } from '../../utils/token/types/user.enum';
import {
  NotFoundException,
  authFailedException,
  emailExistsException,
} from '../errors';
import { LoggerService } from '../../utils/logger/winstonLogger';

export interface IUserService {
  createUser(body: UserCreateReqDto): Promise<any>;
  loginUser(body: UserLoginReqDto): Promise<any>;
  profile(body: UserProfileReqDto): Promise<any>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly logger: LoggerService,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,
  ) {}
  static logInfo = 'Service - User:';

  async createUser(body: UserCreateReqDto) {
    this.logger.info(
      `${UserService.logInfo} Create User with email: ${body.email}`,
    );
    body.password = await this.hashService.hash(body.password);
    try {
      const user = await this.userRepository.save(body);
      const token = {
        id: user.id,
        email: user.email,
        userType: UserType.USER,
      };
      this.logger.info(
        `${UserService.logInfo} Created User with email: ${body.email}`,
      );
      return {
        user: { ...user },
        token: `Bearer ${await this.tokenService.token(token)}`,
      };
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `${UserService.logInfo} Already Exists! User with email: ${body.email}`,
        );
        throw new emailExistsException();
      }
    }
  }

  async loginUser(body: UserLoginReqDto) {
    this.logger.info(
      `${UserService.logInfo} Login User with email: ${body.email}`,
    );
    try {
      const user = await this.userRepository.getByEmail(body.email);
      const isEqual = await this.hashService.compare(
        body.password,
        user.password,
      );
      if (!isEqual) {
        throw new authFailedException();
      }
      const token = {
        id: user.id,
        email: user.email,
        userType: UserType.USER,
      };
      this.logger.info(
        `${UserService.logInfo} LoggedIn User with email: ${body.email}`,
      );
      return {
        user: { ...user },
        token: `Bearer ${await this.tokenService.token(token)}`,
      };
    } catch (error) {
      this.logger.warn(
        `${UserService.logInfo} Incorrect Email or Password for Email: ${body.email}`,
      );
      throw new authFailedException();
    }
  }

  async profile(body: UserProfileReqDto) {
    this.logger.info(
      `${UserService.logInfo} Find User Profile with id: ${body.id}`,
    );
    try {
      const user = await this.userRepository.getById(body.id);
      this.logger.info(
        `${UserService.logInfo} Found User Profile with id: ${body.id}`,
      );
      return user;
    } catch (error) {
      this.logger.warn(
        `${UserService.logInfo} Not Found! User with id: ${body.id}`,
      );
      throw new NotFoundException();
    }
  }
}
