import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BuddyCategoryKey } from '../../common/enums/buddy-category.enum';

export class CreateProfileDto {
  @ApiProperty({ example: 'Ayşe Y.' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName: string;

  @ApiProperty({
    example: 'Bilgisayar müh. 3. sınıf, hafta sonları kahve içmeyi severim.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @ApiProperty({
    example: ['kahve', 'kitap', 'yürüyüş'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(15)
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  interests?: string[];

  @ApiProperty({ example: 'Boğaziçi Üniversitesi', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  university?: string;

  @ApiProperty({ example: 'Kuzey Kampüs', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  campus?: string;

  @ApiProperty({
    description: 'Buddy aranan kategoriler, en az bir tane zorunludur',
    enum: BuddyCategoryKey,
    isArray: true,
    example: [BuddyCategoryKey.COFFEE, BuddyCategoryKey.STUDY],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'En az bir kategori seçilmelidir' })
  @ArrayUnique()
  @IsEnum(BuddyCategoryKey, { each: true })
  categoryKeys: BuddyCategoryKey[];
}
