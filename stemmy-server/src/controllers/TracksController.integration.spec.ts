import { PlatformTest } from '@tsed/common';
import * as SuperTest from 'supertest';
import { TracksController } from './TracksController';
import { Server } from '../Server';
import { ProjectTrackProps, AudioEntityProps } from '../stemmy-common';
import { LoopsController } from './LoopsController';
import { trackBundle } from '../stemmy-common';

const testProjectId = '5f48360dbf9dda3043d2b22c';

describe('TracksController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [TracksController, LoopsController],
      },
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it('should handle GET /tracks/:id with a provided track id and get the track and an audio entity if one is assigned', async () => {
    const { track, audioEntity } = (
      await request.get(`/tracks/5f482f303f86e12f4093d86f`).expect(200)
    ).body;

    expect(track.id);
    if (track.entityId) {
      expect(audioEntity.id);
    }
  });

  it('should handle POST /tracks and get a page of tracks with any audioentities attached', async () => {
    const trackBundles: trackBundle[] = (
      await request.post(`/tracks`).expect(200)
    ).body;

    trackBundles.forEach((trackBundle: trackBundle) => {
      expect(trackBundle.track.id);
      if (trackBundle.track.entityId) {
        expect(trackBundle.audioEntity);
        if (trackBundle.audioEntity) {
          expect(trackBundle.audioEntity.id === trackBundle.track.entityId);
        }
      }
    });
  });

  // it('should call GET /loops', async () => {
  //   const response = await request.get('/loops').expect(200);

  //   expect(response.text).toEqual('hello');
  // });
});
