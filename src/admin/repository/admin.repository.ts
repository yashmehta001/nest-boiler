import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities';
import { Repository } from 'typeorm/repository/Repository';
import { AdminCreateReqDto } from '../dto';

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

  save(admin: AdminCreateReqDto): Promise<AdminEntity> {
    const AdminEntity = this.adminEntity.create(admin);
    return this.adminEntity.save(AdminEntity);
  }

  async getByEmail(email: string): Promise<AdminEntity | undefined> {
    return this.adminEntity.findOne({
      where: {
        email,
      },
    });
  }

  async getById(id: number): Promise<AdminEntity | undefined> {
    return this.adminEntity.findOne({
      where: {
        id,
      },
    });
  }
}
