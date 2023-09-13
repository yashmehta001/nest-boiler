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
import { LoggerService } from 'src/utils/logger/winstonLogger';

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

    private readonly logger: LoggerService,
  ) {}
  static logInfo = 'Database - Admin:';

  async save(adminInfo: AdminCreateReqDto): Promise<AdminEntity> {
    this.logger.info(
      `${AdminRepository.logInfo} Insert Admin with email: ${adminInfo.email}`,
    );
    const adminEntity = this.adminEntity.create(adminInfo);

    try {
      const admin = await this.adminEntity.save(adminEntity);
      this.logger.info(
        `${AdminRepository.logInfo} Inserted Admin with email: ${adminInfo.email}`,
      );
      return admin;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `${AdminRepository.logInfo} Already Exists! Admin with email: ${adminInfo.email}`,
        );
        throw new emailExistsException();
      }
    }
  }

  async getByEmail(email: string): Promise<AdminEntity | undefined> {
    try {
      this.logger.info(
        `${AdminRepository.logInfo} Select Admin with email: ${email}`,
      );
      const admin = await this.adminEntity.findOneOrFail({
        where: {
          email,
        },
      });
      this.logger.info(
        `${AdminRepository.logInfo} Selected Admin with email: ${email}`,
      );
      return admin;
    } catch (error) {
      this.logger.warn(
        `${AdminRepository.logInfo} Not Found! Admin with email: ${email}`,
      );
      throw new authFailedException();
    }
  }

  async getById(id: string): Promise<AdminEntity | undefined> {
    try {
      this.logger.info(
        `${AdminRepository.logInfo} Select Admin with id: ${id}`,
      );
      const admin = await this.adminEntity.findOneOrFail({
        where: {
          id,
        },
      });
      this.logger.info(
        `${AdminRepository.logInfo} Selected Admin with id: ${id}`,
      );
      return admin;
    } catch (error) {
      this.logger.warn(
        `${AdminRepository.logInfo} Not Found! Admin with id: ${id}`,
      );
      throw new NotFoundException();
    }
  }
}
