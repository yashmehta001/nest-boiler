import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AdminResDto {
  @Expose()
  @ApiProperty({
    example: '1',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @Expose()
  @ApiProperty({
    example: 'john@doe.com',
  })
  email: string;
}
