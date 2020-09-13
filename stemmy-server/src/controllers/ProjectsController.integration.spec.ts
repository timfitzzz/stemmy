import { PlatformTest } from '@tsed/common';
import * as SuperTest from 'supertest';
import { LoopsController } from './LoopsController';
import { Server } from '../Server';
import { ProjectProps, trackBundle } from '../stemmy-common';
import { ProjectsController } from './ProjectsController';

let testProject = {
  id: '5f48360dbf9dda3043d2b22c',
  tracks: [],
  clock: {
    BPM: 82.81020395096539,
    BPMIsGuessed: true,
    beatsPerBar: 4,
    length: 23.185548500000003,
    lengthIsSet: false,
    multiplier: 8,
    originalBPM: 82.81020395096539,
  },
  name: '19 Feb 2020, 4%3A06',
};

describe('ProjectsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        '/': [ProjectsController],
      },
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it('should handle GET /projects and provide up to 20 projects on the first page', async () => {
    const response = await request.post('/projects').expect(200);
    const projects = response.body;

    expect(projects.length).toBeLessThanOrEqual(20);
    projects.forEach((project: ProjectProps) => {
      expect(project.id);
      expect(project.clock);
      expect(project.name);
      expect(project.tracks);
    });
  });

  it('should call GET /projects/5f48360dbf9dda3043d2b22c and get the correct project data', async () => {
    const response = await request.get('/projects/5f48360dbf9dda3043d2b22c');

    expect(response.body).toEqual(testProject);
  });

  it('should handle GET /projects/:id/tracks and get the tracks attached to that project including any audioentities assigned', async () => {
    const { tracks } = (
      await request.get(`/projects/5f48360dbf9dda3043d2b22c/tracks`).expect(200)
    ).body;

    if (tracks) {
      tracks.forEach((track: trackBundle) => {
        expect(track.track.id);
        if (track.audioEntity) {
          expect(track.audioEntity.id);
        }
      });
    }
  });
});
