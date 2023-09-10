import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserCreateReqDto,
  UserLoginReqDto,
  UserLoginResDto,
} from './dto/index';
import { Serialize } from 'src/utils/loaders/SerializeDto';
import { UserService } from './services/users.service';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Serialize(UserLoginResDto)
  @ApiResponse({
    description: 'for more information please check UserCreateReqDto schema',
  })
  @ApiOkResponse({
    description:
      'When user registration successfully then this response will receive',
    type: UserLoginResDto,
  })
  @ApiBadRequestResponse({
    description: 'when user email is already taken',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signUp(@Body() body: UserCreateReqDto) {
    return this.userService.createUser(body);
  }

  @Post('/login')
  @Serialize(UserLoginResDto)
  @ApiResponse({
    description: 'for more information please check UserLoginReqDto schema',
  })
  @ApiOkResponse({
    description: 'When user login successfully then this response will receive',
    type: UserLoginResDto,
  })
  @ApiBadRequestResponse({
    description:
      'when user email or password is wrong or user account is ban from admin',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: UserLoginReqDto) {
    return this.userService.loginUser(body);
  }
}
