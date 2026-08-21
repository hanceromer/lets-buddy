import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthenticatedUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { imageFileFilter } from '../storage/image-file-filter';
import { CreateProfileDto } from './dto/create-profile.dto';
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
  getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profilesService.getMyProfile(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Giriş yapmış kullanıcı için profil oluşturur' })
  createProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profilesService.createProfile(user.userId, dto);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Giriş yapmış kullanıcının profilini günceller' })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.userId, dto);
  }

  @Post('me/photo')
  @ApiOperation({ summary: 'Profil fotoğrafını yükler/değiştirir' })
  @ApiConsumes('multipart/form-data')
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
