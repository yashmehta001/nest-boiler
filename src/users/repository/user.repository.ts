import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { UserCreateReqDto } from '../dto';
import {
  NotFoundException,
  authFailedException,
  emailExistsException,
} from '../errors';
import { LoggerService } from 'src/utils/logger/winstonLogger';

export interface IUserRepository {
  save(userEntity: UserEntity): Promise<UserEntity>;

  getByEmail(email: string): Promise<UserEntity>;

  getById(id: string): Promise<UserEntity>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly logger: LoggerService,
  ) {}

  static logInfo = 'Database - User:';

  async save(userInfo: UserCreateReqDto): Promise<UserEntity> {
    this.logger.info(
      `${UserRepository.logInfo} Insert User with email: ${userInfo.email}`,
    );
    const userEntity = this.userEntity.create(userInfo);
    try {
      const user = await this.userEntity.save(userEntity);
      this.logger.info(
        `${UserRepository.logInfo} Inserted User with email: ${user.email}`,
      );
      return user;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `${UserRepository.logInfo} Already Exists! User with email: ${userInfo.email}`,
        );
        throw new emailExistsException();
      }
    }
  }

  async getByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      this.logger.info(
        `${UserRepository.logInfo} Select User with email: ${email}`,
      );
      const user = await this.userEntity.findOneOrFail({
        where: {
          email,
        },
      });
      this.logger.info(
        `${UserRepository.logInfo} Selected User with email: ${email}`,
      );
      return user;
    } catch (error) {
      this.logger.warn(
        `${UserRepository.logInfo} Not Found! User with email: ${email}`,
      );
      throw new authFailedException();
    }
  }

  async getById(id: string): Promise<UserEntity> {
    try {
      this.logger.info(`${UserRepository.logInfo} Select User with id: ${id}`);
      const user = await this.userEntity.findOneOrFail({
        where: {
          id,
        },
      });
      this.logger.info(
        `${UserRepository.logInfo} Selected User with id: ${id}`,
      );
      return user;
    } catch (error) {
      this.logger.warn(
        `${UserRepository.logInfo} Not Found! User with id: ${id}`,
      );
      throw new NotFoundException();
    }
  }
}
