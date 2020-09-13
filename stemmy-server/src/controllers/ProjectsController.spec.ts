import { PlatformTest } from '@tsed/common';
import { LoopsController } from './LoopsController';

describe('LoopsController', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('should do something', () => {
    const instance = PlatformTest.get<LoopsController>(LoopsController);

    expect(instance).toBeInstanceOf(LoopsController);
  });
});
