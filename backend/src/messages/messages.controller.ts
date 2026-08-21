import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
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
import { MatchesService } from '../matches/matches.service';
import { MessageResponseDto } from './dto/message-response.dto';
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
    description:
      'Bu REST endpoint sadece geçmiş mesajları döner. Gerçek zamanlı ' +
      'mesajlaşma Socket.io üzerinden yapılır (OpenAPI şeması bunu ' +
      'kapsamaz), sözleşme şu şekildedir:\n\n' +
      '- Bağlantı: `io(SERVER_URL, { auth: { token: "<accessToken>" } })`\n' +
      '- Gönderme: `socket.emit("sendMessage", { matchId, content }, ack)` ' +
      "— `ack` callback'i kaydedilen MessageResponseDto ile çağrılır\n" +
      '- Dinleme: `socket.on("newMessage", (message: MessageResponseDto) => ...)`\n' +
      "- Hata: yetkisiz/eşleşmesiz gönderim `exception` event'i tetikler",
  })
  @ApiResponse({
    status: 200,
    description: 'createdAt ASC sıralı mesaj listesi.',
    type: [MessageResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Token eksik/geçersiz.' })
  @ApiResponse({
    status: 404,
    description: 'Eşleşme bulunamadı ya da bu kullanıcıya ait değil.',
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
