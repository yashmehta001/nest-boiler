import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AdminCreateReqDto, AdminLoginReqDto, AdminResDto } from '../dto';
import { AdminRepository } from '../repository/admin.repository';
import { TokenService } from 'src/utils/token/services';
import { HashService } from 'src/utils/hash/hash.service';
import { UserType } from 'src/utils/token/types/user.enum';

@Injectable()
export class AdminService {
    constructor(
        @Inject(AdminRepository)
        private readonly adminRepository: AdminRepository,
    
        private readonly hashService: HashService,
    
        private readonly tokenService: TokenService,
      ) {}
    
      async createAdmin(body: AdminCreateReqDto) {
        const isEmailTaken = await this.adminRepository.getByEmail(body.email);
        if (isEmailTaken) {
          throw new BadRequestException();
        }
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
        if (!admin) {
          throw new BadRequestException();
        }
        const isEqual = await this.hashService.compare(
          body.password,
          admin.password,
        );
        if (!isEqual) {
          throw new BadRequestException();
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
    
      async profile(body:AdminResDto){
        const user = await this.adminRepository.getById(body.id)
        if (!user) {
          throw new BadRequestException();
        }
        return user;
      }
}
