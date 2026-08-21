import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column()
  displayName: string;

  // Doğum tarihi bu fazda toplanmıyor (yaş doğrulama/KVKK adımında ele alınacak).
  @Column({ type: 'date', nullable: true })
  birthDate: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ nullable: true })
  university: string | null;

  @Column({ nullable: true })
  campus: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  photoUrls: string[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  interests: string[];

  @ManyToMany(() => Category, (category) => category.profiles)
  @JoinTable({
    name: 'profile_categories',
    joinColumn: { name: 'profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  seekingCategories: Category[];
}
