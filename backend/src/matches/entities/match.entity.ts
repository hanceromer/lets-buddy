import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

/**
 * userA/userB, oluşturulurken uygulama katmanında tutarlı bir sırayla
 * (ör. id'ye göre küçük->büyük) kaydedilmeli; aksi halde aynı çift için
 * (A,B) ve (B,A) şeklinde iki ayrı satır oluşabilir.
 */
@Entity('matches')
@Index(['userAId', 'userBId', 'categoryId'], { unique: true })
export class Match extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_a_id' })
  userA: User;

  @Column({ name: 'user_a_id' })
  userAId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_b_id' })
  userB: User;

  @Column({ name: 'user_b_id' })
  userBId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  matchedAt: Date;
}
