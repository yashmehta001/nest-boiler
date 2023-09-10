import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entities';
import { UserService } from './services/users.service';
import { UserRepository } from './repository/user.repository';
import { HashService } from 'src/utils/hash/hash.service';
import { BcryptService } from 'src/utils/hash/bcrypt/bcrypt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: HashService,
      useClass: BcryptService,
    },
  ],
})
export class UsersModule {}
