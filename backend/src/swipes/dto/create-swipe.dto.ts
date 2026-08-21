import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { BuddyCategoryKey } from '../../common/enums/buddy-category.enum';

export class CreateSwipeDto {
  @ApiProperty({ description: "Kaydırılan (hedef) kullanıcının id'si" })
  @IsUUID()
  swipeeId: string;

  @ApiProperty({
    description: 'Kaydırmanın hangi buddy kategorisi için yapıldığı',
    enum: BuddyCategoryKey,
    example: BuddyCategoryKey.COFFEE,
  })
  @IsEnum(BuddyCategoryKey)
  categoryKey: BuddyCategoryKey;

  @ApiProperty({ description: 'true = beğen, false = geç', example: true })
  @IsBoolean()
  isLike: boolean;
}
