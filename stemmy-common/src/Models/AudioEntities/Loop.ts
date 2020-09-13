import { AudioEntity, AudioEntityProps } from './AudioEntity';
import { mongoose } from '@typegoose/typegoose';

export interface LoopProps extends AudioEntityProps {
  originalProjectId?: string;
  decay?: number;
  loopStartTime?: number;
  originalLoopStartTime?: number;
  originalScale?: number;
}

export class Loop extends AudioEntity<LoopProps> {
  constructor(props: LoopProps) {
    super(...Loop.buildConstructorProps<LoopProps, Loop>(props, 'loops'));
    // var _this = this;
  }
}
