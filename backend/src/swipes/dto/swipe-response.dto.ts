import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SwipeResponseDto {
  @ApiProperty({ example: '1e4a9f2d-5c7a-b3f1-c9a0-6e2d4a3e9c1b' })
  id: string;

  @ApiProperty({ example: '9c1b1e4a-6e2d-4a3e-b3f1-c9a06e2d4a3e' })
  swiperId: string;

  @ApiProperty({ example: '4a3e9c1b-1e4a-6e2d-5c7a-b3f19c1b1e4a' })
  swipeeId: string;

  @ApiProperty({ example: 'b3f1c9a0-6e2d-4a3e-9c1b-1e4a9f2d5c7a' })
  categoryId: string;

  @ApiProperty({ description: 'true = beğen, false = geç', example: true })
  isLike: boolean;

  @ApiProperty({ example: '2026-08-21T10:15:00.000Z' })
  createdAt: Date;
}

export class MatchResponseDto {
  @ApiProperty({ example: '5c7ab3f1-c9a0-6e2d-4a3e-9c1b1e4a9f2d' })
  id: string;

  @ApiProperty({ example: '4a3e9c1b-1e4a-6e2d-5c7a-b3f19c1b1e4a' })
  userAId: string;

  @ApiProperty({ example: '9c1b1e4a-6e2d-4a3e-b3f1-c9a06e2d4a3e' })
  userBId: string;

  @ApiProperty({ example: 'b3f1c9a0-6e2d-4a3e-9c1b-1e4a9f2d5c7a' })
  categoryId: string;

  @ApiProperty({ example: '2026-08-21T10:15:03.000Z' })
  matchedAt: Date;
}

export class CreateSwipeResponseDto {
  @ApiProperty({ type: SwipeResponseDto })
  swipe: SwipeResponseDto;

  @ApiProperty({
    description: 'Bu swipe karşılıklı eşleşmeye sebep olduysa true',
    example: false,
  })
  matched: boolean;

  @ApiPropertyOptional({
    type: MatchResponseDto,
    description: 'matched:true olduğunda dolu gelir',
  })
  match?: MatchResponseDto;
}
