import mongoose from 'mongoose';
import { Property, Ignore, Enum, Required, Schema } from '@tsed/common';
import { Model, ObjectID, Ref, DynamicRef } from '@tsed/mongoose';
import { LoopSchema as Loop } from './LoopSchema';
import { audioEntityTypes } from '../stemmy-common';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Model({ name: 'Track' })
export class TrackSchema {
  @Field()
  @ObjectID('id')
  _id: string;

  @Field((type) => String)
  @Required()
  @Ref('project')
  projectId: Ref<'project'>;

  @Field({ nullable: true })
  @Required()
  @Enum(audioEntityTypes)
  entityType?: audioEntityTypes;

  @Field((type) => String, { nullable: true })
  @Required()
  @DynamicRef('entityType')
  entityId?: DynamicRef<audioEntityTypes>;

  @Field()
  @Property()
  pan: number = 0;

  @Field()
  @Property()
  playing: boolean = false;

  @Field()
  @Property()
  reverse: boolean = false;

  @Field()
  @Property()
  scale: number;

  @Field()
  @Property()
  synchronize: boolean;

  @Field()
  @Property()
  volume: number;
}
