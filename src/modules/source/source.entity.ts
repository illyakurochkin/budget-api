import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseWithTimeStamp } from '../common/base.entity';
import { BlockEntity } from '../block/block.entity';

@ObjectType()
@Entity('sources')
export class SourceEntity extends BaseWithTimeStamp {
  @Field(() => String)
  @Column({ type: 'text' })
  name: string;

  @Field(() => [String])
  @Column({ type: 'text', array: true })
  tags: string[];

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  @Column({ type: 'decimal', nullable: true, default: 0 })
  order: number;

  @Field(() => ID)
  @Column({ type: 'text' })
  userId: string;

  @Field(() => [BlockEntity])
  @OneToMany(() => BlockEntity, (block) => block.source)
  blocks: BlockEntity[];
}
