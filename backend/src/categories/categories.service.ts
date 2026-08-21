import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import {
  BuddyCategoryKey,
  SwipeDirection,
} from '../common/enums/buddy-category.enum';

const DEFAULT_CATEGORIES: Array<Pick<Category, 'key' | 'direction' | 'label'>> =
  [
    {
      key: BuddyCategoryKey.COFFEE,
      direction: SwipeDirection.UP,
      label: 'Kahve Buddy',
    },
    {
      key: BuddyCategoryKey.STUDY,
      direction: SwipeDirection.RIGHT,
      label: 'Ders Buddy',
    },
    {
      key: BuddyCategoryKey.SPORT,
      direction: SwipeDirection.LEFT,
      label: 'Spor Buddy',
    },
    {
      key: BuddyCategoryKey.STREET,
      direction: SwipeDirection.DOWN,
      label: 'Cadde Buddy',
    },
  ];

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    for (const seed of DEFAULT_CATEGORIES) {
      const existing = await this.categoriesRepository.findOne({
        where: { key: seed.key },
      });
      if (!existing) {
        await this.categoriesRepository.save(
          this.categoriesRepository.create(seed),
        );
        this.logger.log(`Seeded category: ${seed.key}`);
      }
    }
  }
}
