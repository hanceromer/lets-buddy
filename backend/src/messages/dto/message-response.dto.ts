import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: '9f2d5c7a-b3f1-c9a0-6e2d-4a3e9c1b1e4a' })
  id: string;

  @ApiProperty({ example: '5c7ab3f1-c9a0-6e2d-4a3e-9c1b1e4a9f2d' })
  matchId: string;

  @ApiProperty({ example: '9c1b1e4a-6e2d-4a3e-b3f1-c9a06e2d4a3e' })
  senderId: string;

  @ApiProperty({ example: 'Selam! Yarın kahve içelim mi?' })
  content: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  readAt: Date | null;

  @ApiProperty({ example: '2026-08-21T10:16:00.000Z' })
  createdAt: Date;
}
