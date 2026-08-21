import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { MatchesService } from '../matches/matches.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

interface SocketAuthPayload {
  userId: string;
  email: string;
}

interface JwtTokenPayload {
  sub: string;
  email: string;
}

function getSocketUser(client: Socket): SocketAuthPayload | undefined {
  return (client.data as { user?: SocketAuthPayload }).user;
}

function setSocketUser(client: Socket, user: SocketAuthPayload): void {
  (client.data as { user?: SocketAuthPayload }).user = user;
}

function matchRoom(matchId: string): string {
  return `match:${matchId}`;
}

/**
 * Gerçek zamanlı mesaj gönderimi burada; mesaj geçmişi (offline'ken
 * gelen mesajlar dahil) MessagesController üzerinden REST ile çekilir.
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection {
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly matchesService: MatchesService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        token,
        { secret: this.configService.get<string>('auth.jwtSecret') },
      );
      const user: SocketAuthPayload = {
        userId: payload.sub,
        email: payload.email,
      };
      setSocketUser(client, user);

      const matches = await this.matchesService.findAllForUser(user.userId);
      for (const match of matches) {
        await client.join(matchRoom(match.id));
      }
      this.logger.log(
        `Bağlandı: ${user.email} (${matches.length} eşleşme odası)`,
      );
    } catch {
      this.logger.warn(
        `Kimlik doğrulanamayan bağlantı reddedildi: ${client.id}`,
      );
      client.emit('error', { message: 'Kimlik doğrulama başarısız.' });
      client.disconnect(true);
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const user = getSocketUser(client);
    if (!user) {
      throw new WsException('Kimlik doğrulanmadı.');
    }

    const match = await this.matchesService.findByIdForUser(
      dto.matchId,
      user.userId,
    );
    if (!match) {
      throw new WsException('Bu eşleşmeye mesaj gönderme yetkiniz yok.');
    }

    const message = await this.messagesService.createMessage(
      dto.matchId,
      user.userId,
      dto.content,
    );

    client.to(matchRoom(dto.matchId)).emit('newMessage', message);

    return message;
  }

  private extractToken(client: Socket): string | undefined {
    const authToken = client.handshake.auth?.token as string | undefined;
    if (authToken) {
      return authToken;
    }
    const header = client.handshake.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      return header.slice('Bearer '.length);
    }
    return undefined;
  }
}
