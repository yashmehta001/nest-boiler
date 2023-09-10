import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { UserCreateReqDto } from '../dto';

export interface IUserRepository {
  save(userEntity: UserEntity): Promise<UserEntity>;

  getByEmail(email: string): Promise<UserEntity | undefined>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  save(user: UserCreateReqDto): Promise<UserEntity> {
    const userEntity = this.userEntity.create(user);
    return this.userEntity.save(userEntity);
  }

  async getByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userEntity.findOne({
      where: {
        email,
      },
    });
  }
}
