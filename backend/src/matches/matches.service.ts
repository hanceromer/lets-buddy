import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUniqueViolation } from '../common/utils/is-unique-violation.util';
import { Match } from './entities/match.entity';

export interface MutualMatchResult {
  match: Match;
  created: boolean;
}

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
  ) {}

  /**
   * userAId/userBId sırası, aynı çift için (A,B) ve (B,A) şeklinde iki ayrı
   * satır oluşmasını engellemek amacıyla burada tutarlı hale getirilir.
   */
  async createMutualMatch(
    userXId: string,
    userYId: string,
    categoryId: string,
  ): Promise<MutualMatchResult> {
    const [userAId, userBId] = [userXId, userYId].sort();

    const existing = await this.matchesRepository.findOne({
      where: { userAId, userBId, categoryId },
    });
    if (existing) {
      return { match: existing, created: false };
    }

    try {
      const match = await this.matchesRepository.save(
        this.matchesRepository.create({ userAId, userBId, categoryId }),
      );
      return { match, created: true };
    } catch (error) {
      if (isUniqueViolation(error)) {
        const raceExisting = await this.matchesRepository.findOne({
          where: { userAId, userBId, categoryId },
        });
        if (raceExisting) {
          return { match: raceExisting, created: false };
        }
      }
      throw error;
    }
  }
}
