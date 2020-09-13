import mongoose from 'mongoose';
import { Property, Ignore, Enum, Required, Schema } from '@tsed/common';
import { Model, ObjectID, Ref, DynamicRef } from '@tsed/mongoose';
import { LoopSchema as Loop } from './LoopSchema';
import { audioEntityTypes } from '../stemmy-common';

@Model({ name: 'Track' })
export class TrackSchema {
  @ObjectID('id')
  _id: string;

  @Required()
  @Ref('project')
  projectId: Ref<'project'>;

  @Required()
  @Enum(audioEntityTypes)
  entityType?: audioEntityTypes;

  @Required()
  @DynamicRef('entityType')
  entityId?: DynamicRef<audioEntityTypes>;

  @Property()
  pan: number;

  @Property()
  playing: boolean;

  @Property()
  reverse: boolean;

  @Property()
  scale: number;

  @Property()
  synchronize: boolean;

  @Property()
  volume: number;
}
