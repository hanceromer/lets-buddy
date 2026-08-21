import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { StorageModule } from '../storage/storage.module';
import { Profile } from './entities/profile.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Category]), StorageModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [TypeOrmModule],
})
export class ProfilesModule {}
