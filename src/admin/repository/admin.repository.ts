import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { AdminCreateReqDto } from '../dto';

export interface IAdminRepository {
  save(userEntity: AdminEntity): Promise<AdminEntity>;

  getByEmail(email: string): Promise<AdminEntity>;

  getById(id: string): Promise<AdminEntity>;
}

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminEntity: Repository<AdminEntity>,
  ) {}
  static logInfo = 'Database - Admin:';

  async save(adminInfo: AdminCreateReqDto): Promise<AdminEntity> {
    const adminEntity = this.adminEntity.create(adminInfo);
    return await this.adminEntity.save(adminEntity);
  }

  async getByEmail(email: string): Promise<AdminEntity | undefined> {
    return await this.adminEntity.findOneOrFail({
      where: {
        email,
      },
    });
  }

  async getById(id: string): Promise<AdminEntity | undefined> {
    return await this.adminEntity.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
