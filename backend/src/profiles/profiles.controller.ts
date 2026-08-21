import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { imageFileFilter } from '../storage/image-file-filter';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Giriş yapmış kullanıcının profilini döner' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Token eksik/geçersiz.' })
  @ApiResponse({ status: 404, description: 'Kullanıcının henüz profili yok.' })
  getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profilesService.getMyProfile(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Giriş yapmış kullanıcı için profil oluşturur' })
  @ApiResponse({ status: 201, type: ProfileResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Zorunlu alan eksik veya geçersiz kategori seçimi.',
  })
  @ApiResponse({ status: 401, description: 'Token eksik/geçersiz.' })
  @ApiResponse({
    status: 409,
    description: 'Bu kullanıcı için zaten bir profil var.',
  })
  createProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profilesService.createProfile(user.userId, dto);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Giriş yapmış kullanıcının profilini günceller' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz kategori seçimi veya alan değeri.',
  })
  @ApiResponse({ status: 401, description: 'Token eksik/geçersiz.' })
  @ApiResponse({ status: 404, description: 'Önce profil oluşturulmalı.' })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.userId, dto);
  }

  @Post('me/photo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Profil fotoğrafını yükler/değiştirir' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
          description: 'jpeg/png/webp, maksimum 5MB',
        },
      },
      required: ['photo'],
    },
  })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Dosya eksik veya desteklenmeyen format.',
  })
  @ApiResponse({ status: 401, description: 'Token eksik/geçersiz.' })
  @ApiResponse({ status: 404, description: 'Önce profil oluşturulmalı.' })
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: MAX_PHOTO_SIZE_BYTES },
      fileFilter: imageFileFilter,
    }),
  )
  uploadPhoto(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("'photo' alanında bir dosya gönderilmeli.");
    }
    return this.profilesService.updatePhoto(user.userId, {
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });
  }
}
