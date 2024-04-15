import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID of the user adding the favorite' })
  userId: number;
  
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID of the favorite repository' })
  repoId: number;
}
