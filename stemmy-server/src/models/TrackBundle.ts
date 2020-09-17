import { Field, ObjectType } from 'type-graphql';
import { audioEntityTypes } from '../stemmy-common';
import { LoopSchema } from './LoopSchema';
import { TrackSchema } from './TrackSchema';

@ObjectType()
export class TrackBundle {
  @Field()
  track: TrackSchema;

  @Field()
  audioEntity?: LoopSchema; // TODO: add join here for future types, or figure out better approach
}
