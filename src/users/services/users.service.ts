import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserCreateReqDto, UserLoginReqDto } from '../dto';
import { UserRepository } from '../repository/user.repository';
import { HashService } from 'src/utils/hash/hash.service';
import { TokenService } from 'src/utils/token/token.service';
import { UserType } from 'src/utils/token/types/user.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly hashService: HashService,

    private readonly tokenService: TokenService,
  ) {}

  async createUser(body: UserCreateReqDto) {
    const isEmailTaken = await this.userRepository.getByEmail(body.email);
    if (isEmailTaken) {
      throw new BadRequestException();
    }
    body.password = await this.hashService.hash(body.password);
    const user = await this.userRepository.save(body);
    const token = {
      id: user.id,
      email: user.email,
      userType: UserType.USER,
    };
    return this.tokenService.token(token);
  }

  async loginUser(body: UserLoginReqDto) {
    const user = await this.userRepository.getByEmail(body.email);
    if (!user) {
      throw new BadRequestException();
    }
    const isEqual = await this.hashService.compare(
      body.password,
      user.password,
    );
    if (!isEqual) {
      throw new BadRequestException();
    }
    const token = {
      id: user.id,
      email: user.email,
      userType: UserType.USER,
    };
    return this.tokenService.token(token);
  }
}
