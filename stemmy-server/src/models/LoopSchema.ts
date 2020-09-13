import mongoose, { MongooseDocument } from 'mongoose';
import {
  Property,
  Ignore,
  Enum,
  Required,
  JsonProperty,
  Title,
  Description,
  Example,
  Schema,
} from '@tsed/common';
import { Model, ObjectID, Ref } from '@tsed/mongoose';
import { AudioEntitySources, PngShapes } from '../stemmy-common';
import { ProjectSchema } from './ProjectSchema';
import { Field, ID, ObjectType } from 'type-graphql';

import { registerEnumType } from 'type-graphql';

registerEnumType(AudioEntitySources, {
  name: 'AudioEntitySources', // this one is mandatory
  description: 'Origin of audio', // this one is optional
});

registerEnumType(PngShapes, {
  name: 'PngShapes', // this one is mandatory
  description: 'Shape of png (round or rectangular)', // this one is optional
});

@ObjectType()
export class png {
  @Field((type) => PngShapes)
  public shape: PngShapes;

  @Field()
  public size: number;

  @Field()
  public path: string;
}

@ObjectType()
@Schema({ title: 'Loop' })
@Model({ name: 'Loop' })
export class LoopSchema {
  @Title('id')
  @Description('Loop model id')
  @Example('5f517db906a2b62adb6916e0')
  @ObjectID('id')
  @Field((type) => ID)
  public _id: string;

  @Description('id of project loop was first used in')
  @Example('5f48360dbf9dda3043d2b22c')
  @Ref(ProjectSchema)
  @Property()
  @Field((type) => String)
  public originalProjectId: Ref<ProjectSchema>;

  @Description(
    'Amount to fade end of loop, expressed as a double between 0 and 1'
  )
  @Example('0')
  @Example('0.1')
  @Property()
  @Field({ nullable: true })
  public decay?: number;

  @Description(
    'Amount of time in  to offshift the beginning of the loop when it is played back'
  )
  @Property()
  @Field({ nullable: true })
  public loopStartTime?: number;

  @Property()
  @Field({ nullable: true })
  public originalLoopStartTime?: number;

  @Property()
  @Field({ nullable: true })
  public originalScale?: number;

  @Property()
  @Field({ nullable: true })
  public fileName?: string;

  @Property()
  @Field((type) => [png], { nullable: true })
  public pngs?: png[];

  @Required()
  @Field((type) => AudioEntitySources, { nullable: true })
  public source?: AudioEntitySources;
}
