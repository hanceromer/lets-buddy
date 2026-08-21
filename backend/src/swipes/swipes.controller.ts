import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { CreateSwipeResponseDto } from './dto/swipe-response.dto';
import { SwipesService } from './swipes.service';

@ApiTags('swipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('swipes')
export class SwipesController {
  constructor(private readonly swipesService: SwipesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Bir kullanıcıyı belirli bir kategoride kaydırır (beğen/geç); ' +
      'karşılıklı beğeni varsa otomatik eşleşme oluşturur',
  })
  @ApiResponse({
    status: 201,
    description:
      'Swipe kaydedildi. matched:true ise match alanı da dolu döner.',
    type: CreateSwipeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Kendi profilinizi kaydıramazsınız / geçersiz istek.',
  })
  @ApiResponse({ status: 401, description: 'Token eksik/geçersiz.' })
  @ApiResponse({
    status: 404,
    description: 'Kategori veya hedef kullanıcı bulunamadı.',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu kullanıcı bu kategoride zaten kaydırıldı.',
  })
  createSwipe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSwipeDto,
  ) {
    return this.swipesService.createSwipe(user.userId, dto);
  }
}
