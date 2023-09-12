import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { UserCreateReqDto } from '../dto';
import { NotFoundException, authFailedException, emailExistsException } from '../errors';

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

  async save(user: UserCreateReqDto): Promise<UserEntity> {
    try{
    const userEntity = this.userEntity.create(user);
      return await this.userEntity.save(userEntity);
    }catch(error){
      if(error.code === '23505'){
        throw new emailExistsException()
      }
    }
  }

  async getByEmail(email: string): Promise<UserEntity | undefined> {
    try{
      return await this.userEntity.findOneOrFail({
      where: {
        email,
      },
    });
  }catch(error){
    throw new authFailedException()
  }
  }

  async getById(id: number): Promise<UserEntity> {
    try{
      return await this.userEntity.findOneOrFail({
        where: {
          id,
        }
      });
    }catch(error){
      throw new NotFoundException()
    }
  }
}
