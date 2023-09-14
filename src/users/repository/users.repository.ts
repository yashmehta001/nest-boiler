import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { UserCreateReqDto } from '../dto';

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
  ) {}

  async save(userInfo: UserCreateReqDto): Promise<UserEntity> {
    const userEntity = this.userEntity.create(userInfo);
    return await this.userEntity.save(userEntity);
  }

  async getByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userEntity.findOneOrFail({
      where: {
        email,
      },
    });
  }

  async getById(id: string): Promise<UserEntity> {
    return await this.userEntity.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
