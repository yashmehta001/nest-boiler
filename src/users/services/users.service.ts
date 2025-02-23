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
import { LoggerService } from '../../utils/logger/WinstonLogger';


export interface IUserService {
  createUser(data: UserCreateReqDto): Promise<any>;
  loginUser(data: UserLoginReqDto): Promise<any>;
  profile(data: UserProfileReqDto): Promise<any>;
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

  async createUser(data: UserCreateReqDto) {
    this.logger.info(
      `${UserService.logInfo} Create User with email: ${data.email}`,
    );
    data.password = await this.hashService.hash(data.password);
    try {
      const user = await this.userRepository.save(data);
      console.log(user);
      const token = {
        id: user.id,
        email: user.email,
        userType: UserType.USER,
      };
      this.logger.info(
        `${UserService.logInfo} Created User with email: ${data.email}`,
      );
      return {
        user: { ...user },
        token: `Bearer ${await this.tokenService.token(token)}`,
      };
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `${UserService.logInfo} Already Exists! User with email: ${data.email}`,
        );
        throw new emailExistsException();
      }
    }
  }

  async loginUser(data: UserLoginReqDto) {
    this.logger.info(
      `${UserService.logInfo} Login User with email: ${data.email}`,
    );
    try {
      const user = await this.userRepository.getByEmail(data.email);
      const isEqual = await this.hashService.compare(
        data.password,
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
        `${UserService.logInfo} LoggedIn User with email: ${data.email}`,
      );
      return {
        user: { ...user },
        token: `Bearer ${await this.tokenService.token(token)}`,
      };
    } catch (error) {
      this.logger.warn(
        `${UserService.logInfo} Incorrect Email or Password for Email: ${data.email}`,
      );
      throw new authFailedException();
    }
  }

  async profile(data: UserProfileReqDto) {
    this.logger.info(
      `${UserService.logInfo} Find User Profile with id: ${data.id}`,
    );
    try {
      const user = await this.userRepository.getById(data.id);
      this.logger.info(
        `${UserService.logInfo} Found User Profile with id: ${data.id}`,
      );
      return user;
    } catch (error) {
      this.logger.warn(
        `${UserService.logInfo} Not Found! User with id: ${data.id}`,
      );
      throw new NotFoundException();
    }
  }
}
