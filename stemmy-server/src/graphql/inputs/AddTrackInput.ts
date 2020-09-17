import { Property, Required } from '@tsed/common';
import { InputType, Field, ID, registerEnumType } from 'type-graphql';
import { TrackSchema } from '../../models/TrackSchema';
import {
  AudioEntitySources,
  audioEntityTypes,
  PngShapes,
} from '../../stemmy-common';

registerEnumType(audioEntityTypes, {
  name: 'audioEntityTypes',
  description: 'Type of audio entity (0 = Loop)',
});

@InputType({ description: 'Initial track settings' })
export class AddTrackInput implements Partial<TrackSchema> {
  @Field((type) => String)
  @Required()
  projectId: string;

  @Field((type) => audioEntityTypes, { nullable: true })
  @Required()
  entityType?: audioEntityTypes;

  @Field()
  @Required()
  entityId: string;

  @Field()
  pan: number = 0;

  @Field()
  playing: boolean = false;

  @Field()
  reverse: boolean = false;

  @Field()
  scale: number;

  @Field()
  synchronize: boolean;

  @Field()
  volume: number;
}
