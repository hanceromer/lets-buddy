import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class ProfileResponseDto {
  @ApiProperty({ example: '6e2d4a3e-9c1b-1e4a-9f2d-5c7ab3f1c9a0' })
  id: string;

  @ApiProperty({ example: '9c1b1e4a-6e2d-4a3e-b3f1-c9a06e2d4a3e' })
  userId: string;

  @ApiProperty({ example: 'Ayşe Y.' })
  displayName: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Bilgisayar müh. 3. sınıf, hafta sonları kahve içmeyi severim.',
  })
  bio: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Boğaziçi Üniversitesi' })
  university: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'Kuzey Kampüs' })
  campus: string | null;

  @ApiProperty({
    type: [String],
    example: ['http://localhost:3000/uploads/profile-photos/abc123.jpg'],
  })
  photoUrls: string[];

  @ApiProperty({ type: [String], example: ['kahve', 'kitap', 'yürüyüş'] })
  interests: string[];

  @ApiProperty({ type: [CategoryResponseDto] })
  seekingCategories: CategoryResponseDto[];

  @ApiProperty({ example: '2026-08-21T10:15:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-21T10:15:00.000Z' })
  updatedAt: Date;
}
