import { Inject, Injectable } from '@nestjs/common';
import { UserCreateReqDto, UserLoginReqDto, UserProfileReqDto } from '../dto';
import { UserRepository } from '../repository/user.repository';
import { TokenService } from 'src/utils/token/services';
import { HashService } from 'src/utils/hash/hash.service';
import { UserType } from 'src/utils/token/types/user.enum';
import { authFailedException } from '../errors';
import { LoggerService } from 'src/utils/logger/winstonLogger';

@Injectable()
export class UserService {
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
      `${UserService.logInfo} Create User with email : ${body.email}`,
    );
    body.password = await this.hashService.hash(body.password);
    const user = await this.userRepository.save(body);
    const token = {
      id: user.id,
      email: user.email,
      userType: UserType.USER,
    };
    this.logger.info(
      `${UserService.logInfo} Created User with email : ${body.email}`,
    );
    return {
      user: { ...user },
      token: `Bearer ${await this.tokenService.token(token)}`,
    };
  }

  async loginUser(body: UserLoginReqDto) {
    this.logger.info(
      `${UserService.logInfo} Login User with email : ${body.email}`,
    );
    const user = await this.userRepository.getByEmail(body.email);
    const isEqual = await this.hashService.compare(
      body.password,
      user.password,
    );
    if (!isEqual) {
      this.logger.warn(
        `${UserService.logInfo} Authentication Failed for User with email : ${body.email}`,
      );
      throw new authFailedException();
    }
    const token = {
      id: user.id,
      email: user.email,
      userType: UserType.USER,
    };
    this.logger.info(
      `${UserService.logInfo} LoggedIn User with email : ${body.email}`,
    );
    return {
      user: { ...user },
      token: `Bearer ${await this.tokenService.token(token)}`,
    };
  }

  async profile(body: UserProfileReqDto) {
    this.logger.info(
      `${UserService.logInfo} Find User Profile with email : ${body.id}`,
    );
    const user = await this.userRepository.getById(body.id);
    this.logger.info(
      `${UserService.logInfo} Found User Profile with email : ${body.id}`,
    );
    return user;
  }
}
