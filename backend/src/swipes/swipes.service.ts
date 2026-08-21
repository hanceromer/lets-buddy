import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { isUniqueViolation } from '../common/utils/is-unique-violation.util';
import { Match } from '../matches/entities/match.entity';
import { MatchesService } from '../matches/matches.service';
import { User } from '../users/entities/user.entity';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { Swipe } from './entities/swipe.entity';

export interface CreateSwipeResult {
  swipe: Swipe;
  matched: boolean;
  match?: Match;
}

@Injectable()
export class SwipesService {
  constructor(
    @InjectRepository(Swipe)
    private readonly swipesRepository: Repository<Swipe>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly matchesService: MatchesService,
  ) {}

  async createSwipe(
    swiperId: string,
    dto: CreateSwipeDto,
  ): Promise<CreateSwipeResult> {
    if (dto.swipeeId === swiperId) {
      throw new BadRequestException('Kendi profilinizi kaydıramazsınız.');
    }

    const [category, swipee] = await Promise.all([
      this.categoriesRepository.findOne({ where: { key: dto.categoryKey } }),
      this.usersRepository.findOne({ where: { id: dto.swipeeId } }),
    ]);

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı.');
    }
    if (!swipee) {
      throw new NotFoundException('Kaydırılan kullanıcı bulunamadı.');
    }

    const existingSwipe = await this.swipesRepository.findOne({
      where: { swiperId, swipeeId: dto.swipeeId, categoryId: category.id },
    });
    if (existingSwipe) {
      throw new ConflictException(
        'Bu kullanıcıyı bu kategoride zaten kaydırdınız.',
      );
    }

    let swipe: Swipe;
    try {
      swipe = await this.swipesRepository.save(
        this.swipesRepository.create({
          swiperId,
          swipeeId: dto.swipeeId,
          categoryId: category.id,
          isLike: dto.isLike,
        }),
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Bu kullanıcıyı bu kategoride zaten kaydırdınız.',
        );
      }
      throw error;
    }

    if (!dto.isLike) {
      return { swipe, matched: false };
    }

    const reciprocalSwipe = await this.swipesRepository.findOne({
      where: {
        swiperId: dto.swipeeId,
        swipeeId: swiperId,
        categoryId: category.id,
        isLike: true,
      },
    });
    if (!reciprocalSwipe) {
      return { swipe, matched: false };
    }

    const { match } = await this.matchesService.createMutualMatch(
      swiperId,
      dto.swipeeId,
      category.id,
    );

    return { swipe, matched: true, match };
  }
}
