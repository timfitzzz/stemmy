import { deepExtends, EnvTypes } from '@tsed/core';

const rootDir = __dirname;

export const conf = {
  pngs: {
    storagePath: `${rootDir}/../fileStore/pngs`,
    roundSizes: [300, 600],
  },
};
