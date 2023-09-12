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

@Injectable()
export class AdminService {
  constructor(
    @Inject(AdminRepository)
    private readonly adminRepository: AdminRepository,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,
  ) {}

  async createAdmin(body: AdminCreateReqDto) {
    body.password = await this.hashService.hash(body.password);
    const admin = await this.adminRepository.save(body);
    const token = {
      id: admin.id,
      email: admin.email,
      userType: UserType.ADMIN,
    };
    return {
      user: { ...admin },
      token: `Bearer ${await this.tokenService.token(token)}`,
    };
  }

  async loginAdmin(body: AdminLoginReqDto) {
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
    return {
      user: { ...admin },
      token: `Bearer ${await this.tokenService.token(token)}`,
    };
  }

  async profile(body: AdminProfileReqDto) {
    const user = await this.adminRepository.getById(body.id);
    return user;
  }
}
