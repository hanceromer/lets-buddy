import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import {
  BuddyCategoryKey,
  SwipeDirection,
} from '../../common/enums/buddy-category.enum';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'enum', enum: BuddyCategoryKey, unique: true })
  key: BuddyCategoryKey;

  @Column({ type: 'enum', enum: SwipeDirection, unique: true })
  direction: SwipeDirection;

  @Column()
  label: string;

  @ManyToMany(() => Profile, (profile) => profile.seekingCategories)
  profiles: Profile[];
}
