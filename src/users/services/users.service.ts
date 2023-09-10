import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserCreateReqDto, UserLoginReqDto } from '../dto';
import { UserRepository } from '../repository/user.repository';
import { HashService } from 'src/utils/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly hashService: HashService,
  ) {}

  async createUser(body: UserCreateReqDto) {
    const user = await this.userRepository.getByEmail(body.email);
    if (user) {
      throw new BadRequestException();
    }
    body.password = await this.hashService.hash(body.password);
    return this.userRepository.save(body);
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
    return true;
  }
}
