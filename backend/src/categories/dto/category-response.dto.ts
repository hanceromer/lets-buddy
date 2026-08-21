import { ApiProperty } from '@nestjs/swagger';
import {
  BuddyCategoryKey,
  SwipeDirection,
} from '../../common/enums/buddy-category.enum';

export class CategoryResponseDto {
  @ApiProperty({ example: 'b3f1c9a0-6e2d-4a3e-9c1b-1e4a9f2d5c7a' })
  id: string;

  @ApiProperty({ enum: BuddyCategoryKey, example: BuddyCategoryKey.COFFEE })
  key: BuddyCategoryKey;

  @ApiProperty({ enum: SwipeDirection, example: SwipeDirection.UP })
  direction: SwipeDirection;

  @ApiProperty({ example: 'Kahve Buddy' })
  label: string;
}
