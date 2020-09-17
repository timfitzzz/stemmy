import { InputType, Field, ID } from 'type-graphql';
import { ProjectSchema, ProjectClockSchema } from '../../models/ProjectSchema';

@InputType({ description: 'Project clock settings' })
export class ProjectClockInput implements Partial<ProjectClockSchema> {
  @Field({ nullable: true })
  BPM?: number;

  @Field({ nullable: true })
  BPMIsGuessed?: boolean;

  @Field({ nullable: true })
  beatsPerBar?: number;

  @Field({ nullable: true })
  length?: number;

  @Field({ nullable: true })
  lengthIsSet?: boolean;

  @Field({ nullable: true })
  multiplier?: number;

  @Field({ nullable: true })
  originalBPM?: number;
}

@InputType({ description: 'Initial project data' })
export class AddProjectInput implements Partial<ProjectSchema> {
  @Field()
  name: string;

  @Field((type) => [String], { nullable: true })
  tracks: string[];

  @Field((type) => ID, { nullable: true })
  _id: string;

  @Field((type) => ProjectClockInput, { nullable: true })
  clock: ProjectClockInput;
}
