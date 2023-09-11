import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserCreateReqDto,
  UserLoginReqDto,
  UserLoginResDto,
  UserProfileReqDto,
  UserResDto,
} from './dto/index';
import { Serialize } from 'src/utils/loaders/SerializeDto';
import { UserService } from './services/users.service';
import { AuthType } from 'src/utils/token/types';
import { Auth } from 'src/utils/decorators/auth.decorator';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Auth(AuthType.None)
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

  @Auth(AuthType.None)
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


  @Serialize(UserResDto)
  @ApiResponse({
    description: 'for more information please check UserLoginReqDto schema',
  })
  @ApiOkResponse({
    description: 'When user profile is successfully retrived then this response will receive',
    type: UserResDto,
  })
  @ApiBadRequestResponse({
    description:
      'when user not found',
  })
  @ApiBearerAuth()
  @Get('/profile')
  async profile(@Headers('user') user: UserProfileReqDto){
    return this.userService.profile(user);
  }
}
