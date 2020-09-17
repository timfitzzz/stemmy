import mongoose from 'mongoose';
import { Property, Ignore, Enum, Required } from '@tsed/common';
import { Model, ObjectID, Schema, Ref } from '@tsed/mongoose';
import { TrackSchema } from './TrackSchema';
import { ObjectType, Field, ID, InputType } from 'type-graphql';

@ObjectType()
@Schema()
export class ProjectClockSchema {
  @Property()
  @Field()
  BPM?: number;

  @Property()
  @Field()
  BPMIsGuessed?: boolean;

  @Property()
  @Field()
  beatsPerBar?: number;

  @Property()
  @Field()
  length?: number;

  @Property()
  @Field()
  lengthIsSet?: boolean;

  @Property()
  @Field()
  multiplier?: number;

  @Property()
  @Field()
  originalBPM?: number;
}

@ObjectType()
@Model({ name: 'Project' })
export class ProjectSchema {
  @ObjectID('id')
  @Field((type) => ID, { nullable: true })
  _id: string;

  @Ref('TrackSchema')
  @Field((type) => [String])
  tracks?: Ref<TrackSchema>[];

  @Property()
  @Field((type) => ProjectClockSchema)
  clock?: ProjectClockSchema;

  // @Property()
  // ownerId: string;

  @Property()
  @Field()
  name?: string;
}
