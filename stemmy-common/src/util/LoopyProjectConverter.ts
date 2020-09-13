// import { resolve } from 'path';
// import plist, { PlistValue, PlistObject } from 'plist';

// import { Loop, audioEntityTypes, LoopProps } from '../Models/AudioEntities';
// import fs, { Dirent } from 'fs';

// import {
//   Project,
//   ProjectProps,
//   ProjectClockSettings,
//   ProjectTrack,
//   ProjectTrackProps,
// } from '../Models/Project';

// // import {
// //   LoopySessionClockSettings,
// //   LoopySessionTrackSettings,
// //   LoopySessionTrack,
// //   LoopySessionData,
// //   LoopySessionReader,
// // } from '../Models/LoopyEntities';

// // export class LoopyProjectImporter {
// //   sessionData: LoopySessionData;

// //   project: Project;
// //   tracks: ProjectTrack[] = [];
// //   loops: Loop[] = [];

// //   constructor(
// //     public sessionDataPlist: string,
// //     public trackName: string,
// //     public wavOutputPath: string,
// //     public sessionFolderPath: string
// //   ) {
// //     this.sessionData = plist.parse(sessionDataPlist) as PlistObject &
// //       LoopySessionData;
// //     const projectProps: ProjectProps = {
// //       ...(this.sessionData as ProjectProps),
// //       name: trackName,
// //     };
// //     this.project = this.buildProject(projectProps);
// //     const projectCb = this.project.on('save', () => {
// //       this.project.remove('save', projectCb);
// //       const projectId = this.project.get('id');
// //       const loopCount = this.sessionData.tracks.length;
// //       const loopArr: Loop[] = new Array(loopCount);
// //       const trackArr: ProjectTrack[] = new Array(loopCount);

// //       if (projectId) {
// //         // import all loops and move them all to destination folder
// //         this.sessionData.tracks.forEach(
// //           (track: LoopySessionTrack, index): void => {
// //             const newLoop = this.importLoopyLoop(
// //               track,
// //               trackName,
// //               projectId,
// //               index,
// //               sessionFolderPath,
// //               wavOutputPath
// //             );

// //             newLoop.on('save', () => {
// //               this.loops.push(newLoop);
// //               loopArr[index] = newLoop;
// //             });

// //             newLoop.save();
// //           }
// //         );

// //         // wait while loops are importing
// //         while (loopArr.length < this.sessionData.tracks.length) {
// //           setTimeout(() => {}, 500);
// //         }

// //         // link loops into projecttracks and attach them to projects
// //         loopArr.forEach((loop: Loop, index: number): void => {
// //           if (typeof loop.get('id') === 'number') {
// //             const newTrack = this.buildTrack(
// //               this.sessionData.tracks[index],
// //               projectId,
// //               loop.get('id') as number
// //             );

// //             newTrack.on('save', () => {
// //               this.tracks.push(newTrack);
// //               trackArr[index] = newTrack;
// //             });
// //           } else {
// //             throw new Error('');
// //           }
// //         });

// //         // wait while tracks are being generated and saved
// //         while (trackArr.length < this.sessionData.tracks.length) {
// //           setTimeout(() => {}, 500);
// //         }

// //         this.project.addProjectTracks;
// //       } else {
// //         throw new Error('Projectid not found');
// //       }
// //     });

// //     this.project.save();
// //     this.sessionData.tracks;
// //     // this.tracks = this.sessionData.
// //     // this.project.addProjectTracks(
// //     //   this.sessionData
// //     // )
// //   }

// //   buildProject(sessionData: ProjectProps): Project {
// //     return Project.buildProject(sessionData);
// //   }

// //   buildTrack(
// //     props: LoopySessionTrack,
// //     projectId: number,
// //     loopId: number
// //   ): ProjectTrack {
// //     const newProps: ProjectTrackProps = Object.assign(props, { projectId });
// //     const track = ProjectTrack.buildProjectTrack(newProps);
// //     track.attachEntity(audioEntityTypes.Loop, loopId);

// //     return track;
// //   }

// //   importLoopyLoop(
// //     props: LoopySessionTrack,
// //     loopySessionName: string,
// //     originalProjectId: number,
// //     trackNumber: number,
// //     folderPath: string,
// //     outFolderPath: string
// //   ): Loop {
// //     const fileBuffer: Buffer = fs.readFileSync(
// //       folderPath + `/Media/Track ${trackNumber}.aiff`
// //     );
// //     const loopFileName: string = `${loopySessionName}-track${trackNumber}.aiff`;
// //     const outFilePath: string = `${outFolderPath}/${loopFileName}`;
// //     fs.writeFileSync(outFilePath, fileBuffer);

// //     const newLoopProps: LoopProps = Object.assign(props, {
// //       originalProjectId,
// //       filePath: outFilePath,
// //     });

// //     return new Loop(newLoopProps);
// //   }

// //   // public processTrack(trackId: number, trackPath: string, trackProperties: LoopySessionTrack): void {
// //   //   const track = ProjectTrack.buildProjectTrack(trackProperties);
// //   // }
// // }

// // class LoopyFolderReader {
// //   sessions: LoopySessionData[] = [];

// //   constructor(public folderPath: string) {

// //   }

// //   read(): void {

// //   }

// // }

// // export class LoopySessionReader {
// //   static from
// // }
