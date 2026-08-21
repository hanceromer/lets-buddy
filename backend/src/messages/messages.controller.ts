import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchesService } from '../matches/matches.service';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches/:matchId/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly matchesService: MatchesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Bir eşleşmeye ait mesaj geçmişini kronolojik sırayla döner',
  })
  async getMatchMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('matchId', ParseUUIDPipe) matchId: string,
  ) {
    const match = await this.matchesService.findByIdForUser(
      matchId,
      user.userId,
    );
    if (!match) {
      throw new NotFoundException('Eşleşme bulunamadı.');
    }
    return this.messagesService.findByMatch(matchId);
  }
}
