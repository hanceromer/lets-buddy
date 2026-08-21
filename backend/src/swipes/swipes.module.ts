import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { MatchesModule } from '../matches/matches.module';
import { User } from '../users/entities/user.entity';
import { Swipe } from './entities/swipe.entity';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Swipe, Category, User]), MatchesModule],
  controllers: [SwipesController],
  providers: [SwipesService],
  exports: [TypeOrmModule],
})
export class SwipesModule {}
