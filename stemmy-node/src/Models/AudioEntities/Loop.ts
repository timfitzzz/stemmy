import { AudioEntity, AudioEntityProps } from './AudioEntity';

export interface LoopProps extends AudioEntityProps {
  id?: number;
  originalProjectId: number;
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
