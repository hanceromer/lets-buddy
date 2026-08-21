import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSwipeDto } from './dto/create-swipe.dto';
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
  createSwipe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSwipeDto,
  ) {
    return this.swipesService.createSwipe(user.userId, dto);
  }
}
