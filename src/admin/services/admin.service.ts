import { Inject, Injectable } from '@nestjs/common';
import {
  AdminCreateReqDto,
  AdminLoginReqDto,
  AdminProfileReqDto,
} from '../dto';
import { AdminRepository } from '../repository/admin.repository';
import { TokenService } from '../../utils/token/services';
import { HashService } from '../../utils/hash/hash.service';
import { UserType } from '../../utils/token/types/user.enum';
import {
  NotFoundException,
  authFailedException,
  emailExistsException,
} from '../errors';
import { LoggerService } from '../../utils/logger/winstonLogger';
import { AdminUsersSeedData } from '../seed-data/admin-user.seed-data';

@Injectable()
export class AdminService {
  constructor(
    @Inject(AdminRepository)
    private readonly adminRepository: AdminRepository,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,

    private readonly logger: LoggerService,
  ) {}
  static logInfo = 'Service - Admin:';

  async createAdmin(body: AdminCreateReqDto) {
    this.logger.info(
      `${AdminService.logInfo} Create Admin with email: ${body.email}`,
    );
    body.password = await this.hashService.hash(body.password);
    try {
      const admin = await this.adminRepository.save(body);
      const token = {
        id: admin.id,
        email: admin.email,
        userType: UserType.ADMIN,
      };
      this.logger.info(
        `${AdminService.logInfo} Created Admin with email: ${body.email}`,
      );
      return {
        user: { ...admin },
        token: `Bearer ${await this.tokenService.token(token)}`,
      };
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `${AdminService.logInfo} Already Exists! Admin with email: ${body.email}`,
        );
        throw new emailExistsException();
      }
    }
  }

  async loginAdmin(body: AdminLoginReqDto) {
    this.logger.info(
      `${AdminService.logInfo} Login Admin with email: ${body.email}`,
    );
    try {
      const admin = await this.adminRepository.getByEmail(body.email);
      const isEqual = await this.hashService.compare(
        body.password,
        admin.password,
      );
      if (!isEqual) {
        throw new authFailedException();
      }
      const token = {
        id: admin.id,
        email: admin.email,
        userType: UserType.ADMIN,
      };
      this.logger.info(
        `${AdminService.logInfo} LoggedIn Admin with email: ${body.email}`,
      );
      return {
        user: { ...admin },
        token: `Bearer ${await this.tokenService.token(token)}`,
      };
    } catch (error) {
      this.logger.warn(
        `${AdminService.logInfo} Incorrect Email or Password for Email: ${body.email}`,
      );
      throw new authFailedException();
    }
  }

  async profile(body: AdminProfileReqDto) {
    this.logger.info(
      `${AdminService.logInfo} Find Admin Profile with id: ${body.id}`,
    );
    try {
      const admin = await this.adminRepository.getById(body.id);
      this.logger.info(
        `${AdminService.logInfo} Found Admin Profile with id: ${body.id}`,
      );
      return admin;
    } catch (error) {
      this.logger.warn(
        `${AdminService.logInfo} Not Found! Admin with id: ${body.id}`,
      );
      throw new NotFoundException();
    }
  }

  async seedAdminUserGroup(): Promise<void> {
    this.logger.info(`${AdminService.logInfo} Seeding Admin Users`);
    if (AdminUsersSeedData?.[0]?.email) {
      for (let i = 0; i < AdminUsersSeedData.length; i++) {
        AdminUsersSeedData[i].password = await this.hashService.hash(
          AdminUsersSeedData[i].password,
        );
        await this.adminRepository.save(AdminUsersSeedData[i]);
      }
      this.logger.info(`${AdminService.logInfo} Seeded Admin Users`);
    } else {
      this.logger.warn(
        `${AdminService.logInfo} Seed Admin Users Data not Found`,
      );
    }
  }
}
