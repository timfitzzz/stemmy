import { PlatformTest } from '@tsed/common';
import * as SuperTest from 'supertest';
import { LoopsController } from './LoopsController';
import { Server } from '../Server';

import mongoose from 'mongoose';
import { LoopProps } from '../stemmy-common';
import fs from 'fs';

import { testLoop, testLoopFile } from '../../testData/loops';

const databaseName = 'default';

const existingTestLoop = {
  id: '5f517db906a2b62adb6916e0',
  pngs: [],
  originalProjectId: '5f482f2f3f86e12f4093d861',
  decay: 0,
  loopStartTime: 0,
  originalLoopStartTime: -1,
  originalScale: 0,
  fileName: 'p5f482f2f3f86e12f4093d861-5.aiff',
  source: 2,
};

const partialLoop = {
  pngs: [],
  originalProjectId: '5f482f2f3f86e12f4093d861',
  decay: 0,
  loopStartTime: 0,
  originalLoopStartTime: -1,
  originalScale: 0,
  source: 2,
};

// beforeAll(async () => {
//   const url = `mongodb://127.0.0.1/${databaseName}`;
//   await mongoose.connect(url, { useNewUrlParser: true });
// });

describe('LoopsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [LoopsController],
      },
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it('should call GET /loops and get one page of loops', async () => {
    const response = await request.post('/loops').expect(200);

    const loops: LoopProps[] = response.body;
    expect(loops.length).toBeLessThanOrEqual(20);
    loops.forEach((loop: LoopProps) => {
      expect(loop.id);
      expect(loop.originalProjectId);
      expect(loop.fileName);
    });
    expect(response.body.forEach);
  });

  it('should call GET /loops/5f517db906a2b62adb6916e0 and receive the correct output', async () => {
    const response = await request.get('/loops/5f517db906a2b62adb6916e0');

    expect(response.body).toEqual(existingTestLoop);
  });

  // it('should call POST /loop/create with props for a new loop, and receive a loop object back, then be able to update that loop with a file using /loop/upload', async () => {
  //   const response = await request.post('/loops/create').send(testLoop);
  //   Object.getOwnPropertyNames(testLoop).forEach((propertyName) => {
  //     //@ts-ignore
  //     expect(response.body[propertyName]).toEqual(testLoop[propertyName]);
  //   });
  //   expect(response.body.id);

  //   const fileResponse = await request
  //     .post(`/loops/upload/`)
  //     .field('id', response.body.id)
  //     .attach('file', testLoopFile, 'testLoop.aiff');

  //   console.log(fileResponse.body);
  //   Object.getOwnPropertyNames(testLoop).forEach((propertyName) => {
  //     //@ts-ignore
  //     expect(fileResponse.body[propertyName]).toEqual(testLoop[propertyName]);
  //   });

  //   expect(typeof fileResponse.body.fileName).toBe('string');
  // });

  it('should call POST /loop/upload with props for a new loop and a get an array of 1 loop object back', async () => {
    const response = await request
      .post('/loops/upload')
      .field('loopData', JSON.stringify([partialLoop]))
      .attach('files', testLoopFile, 'testFile')
      .expect(200);

    expect(response.body.length).toEqual(1);
  });

  it('should call POST /loop/upload with props for multiple loops and get an array of as many loop objects back', async () => {
    const response = await request
      .post('/loops/upload')
      .field('loopData', JSON.stringify([partialLoop, partialLoop]))
      .attach('files', testLoopFile, 'testFile1')
      .attach('files', testLoopFile, 'testFile2')
      .expect(200);

    console.log(response.body);

    expect(response.body.length).toEqual(2);
  });
});
