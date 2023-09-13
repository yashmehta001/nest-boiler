import { Inject, Injectable } from '@nestjs/common';
import {
  AdminCreateReqDto,
  AdminLoginReqDto,
  AdminProfileReqDto,
} from '../dto';
import { AdminRepository } from '../repository/admin.repository';
import { TokenService } from 'src/utils/token/services';
import { HashService } from 'src/utils/hash/hash.service';
import { UserType } from 'src/utils/token/types/user.enum';
import { authFailedException } from '../errors';
import { LoggerService } from 'src/utils/logger/winstonLogger';

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
  }

  async loginAdmin(body: AdminLoginReqDto) {
    this.logger.info(
      `${AdminService.logInfo} Login Admin with email: ${body.email}`,
    );
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
  }

  async profile(body: AdminProfileReqDto) {
    this.logger.info(
      `${AdminService.logInfo} Find Admin Profile with id: ${body.id}`,
    );
    const user = await this.adminRepository.getById(body.id);
    this.logger.info(
      `${AdminService.logInfo} Found Admin Profile with id: ${body.id}`,
    );
    return user;
  }
}
