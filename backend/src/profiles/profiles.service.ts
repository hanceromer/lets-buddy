import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  STORAGE_SERVICE,
  type StorageService,
  type UploadableFile,
} from '../storage/storage.interface';
import { Category } from '../categories/entities/category.entity';
import { BuddyCategoryKey } from '../common/enums/buddy-category.enum';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

const PROFILE_PHOTOS_FOLDER = 'profile-photos';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async getMyProfile(userId: string): Promise<Profile> {
    return this.findByUserIdOrFail(userId);
  }

  async createProfile(userId: string, dto: CreateProfileDto): Promise<Profile> {
    const existing = await this.profilesRepository.findOne({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException(
        'Bu kullanıcı için zaten bir profil mevcut, güncelleme uç noktasını kullanın.',
      );
    }

    const seekingCategories = await this.resolveCategories(dto.categoryKeys);

    const profile = this.profilesRepository.create({
      userId,
      displayName: dto.displayName,
      bio: dto.bio ?? null,
      interests: dto.interests ?? [],
      university: dto.university ?? null,
      campus: dto.campus ?? null,
      seekingCategories,
    });

    return this.profilesRepository.save(profile);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findByUserIdOrFail(userId);

    if (dto.displayName !== undefined) {
      profile.displayName = dto.displayName;
    }
    if (dto.bio !== undefined) {
      profile.bio = dto.bio;
    }
    if (dto.interests !== undefined) {
      profile.interests = dto.interests;
    }
    if (dto.university !== undefined) {
      profile.university = dto.university;
    }
    if (dto.campus !== undefined) {
      profile.campus = dto.campus;
    }
    if (dto.categoryKeys !== undefined) {
      profile.seekingCategories = await this.resolveCategories(
        dto.categoryKeys,
      );
    }

    return this.profilesRepository.save(profile);
  }

  async updatePhoto(userId: string, file: UploadableFile): Promise<Profile> {
    const profile = await this.findByUserIdOrFail(userId);

    const photoUrl = await this.storageService.upload(
      file,
      PROFILE_PHOTOS_FOLDER,
    );
    profile.photoUrls = [photoUrl];

    return this.profilesRepository.save(profile);
  }

  private async findByUserIdOrFail(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: { seekingCategories: true },
    });
    if (!profile) {
      throw new NotFoundException(
        'Profil bulunamadı, önce profil oluşturmalısınız.',
      );
    }
    return profile;
  }

  private async resolveCategories(
    categoryKeys: BuddyCategoryKey[],
  ): Promise<Category[]> {
    const uniqueKeys = [...new Set(categoryKeys)];
    const categories = await this.categoriesRepository.find({
      where: { key: In(uniqueKeys) },
    });
    if (categories.length !== uniqueKeys.length) {
      throw new BadRequestException('Geçersiz kategori seçimi.');
    }
    return categories;
  }
}
