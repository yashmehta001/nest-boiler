import { Expose, Type } from 'class-transformer';
import { AdminResDto } from '../index';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResDto {
  @Expose()
  @Type(() => AdminResDto)
  @ApiProperty({ type: () => AdminResDto })
  user: AdminResDto;

  @Expose()
  @ApiProperty({
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGRvZS5jb20iLCJ1c2VyVHlwZSI6InVzZXIiLCJpYXQiOjE2OTQ0MDg0MTcsImV4cCI6MTY5NDQxMjAxN30.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;
}
