import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserCreateReqDto, UserLoginReqDto, UserProfileReqDto, UserResDto } from '../dto';
import { UserRepository } from '../repository/user.repository';
import { TokenService } from 'src/utils/token/services';
import { HashService } from 'src/utils/hash/hash.service';
import { UserType } from 'src/utils/token/types/user.enum';
import { authFailedException } from '../errors';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,
  ) {}

  async createUser(body: UserCreateReqDto) {
    body.password = await this.hashService.hash(body.password);
    const user = await this.userRepository.save(body);
    const token = {
      id: user.id,
      email: user.email,
      userType: UserType.USER,
    };
    return {
      user: { ...user },
      token: `Bearer ${await this.tokenService.token(token)}`,
    };
  }

  async loginUser(body: UserLoginReqDto) {
    const user = await this.userRepository.getByEmail(body.email);
    const isEqual = await this.hashService.compare(
      body.password,
      user.password,
    );
    if (!isEqual) {
      throw new authFailedException();
    }
    const token = {
      id: user.id,
      email: user.email,
      userType: UserType.USER,
    };
    return {
      user: { ...user },
      token: `Bearer ${await this.tokenService.token(token)}`,
    };
  }

  async profile(body: UserProfileReqDto) {
    const user = await this.userRepository.getById(body.id);
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }
}
