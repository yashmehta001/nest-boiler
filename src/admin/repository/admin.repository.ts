import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { AdminCreateReqDto } from '../dto';
import {
  NotFoundException,
  authFailedException,
  emailExistsException,
} from '../errors';

export interface IAdminRepository {
  save(userEntity: AdminEntity): Promise<AdminEntity>;

  getByEmail(email: string): Promise<AdminEntity | undefined>;
}

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminEntity: Repository<AdminEntity>,
  ) {}

  async save(admin: AdminCreateReqDto): Promise<AdminEntity> {
    try {
      const AdminEntity = this.adminEntity.create(admin);
      return await this.adminEntity.save(AdminEntity);
    } catch (error) {
      if (error.code === '23505') {
        throw new emailExistsException();
      }
    }
  }

  async getByEmail(email: string): Promise<AdminEntity | undefined> {
    try {
      return await this.adminEntity.findOneOrFail({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new authFailedException();
    }
  }

  async getById(id: string): Promise<AdminEntity | undefined> {
    try {
      return await this.adminEntity.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
