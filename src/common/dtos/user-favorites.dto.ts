import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserFavoritesManagementDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
  
  @ApiProperty()
  resourceId: string | number;
}
