import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseWithTimeStamp } from '../common/base.entity';
import { SourceEntity } from '../source/source.entity';

@ObjectType()
@Entity('blocks')
export class BlockEntity extends BaseWithTimeStamp {
  @Field(() => Date)
  @Column({ type: 'date' })
  date: Date;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  sourceId: string;

  @Field(() => SourceEntity)
  @ManyToOne(() => SourceEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  source: SourceEntity;

  @Field(() => Number)
  @Column({ type: 'decimal' })
  amount: number;

  @Field(() => String)
  @Column({ type: 'text' })
  currency: string;

  @Field(() => Number)
  @Column({ type: 'decimal' })
  amountInUSD: number;
}
