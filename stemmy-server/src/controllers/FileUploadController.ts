// import { Controller, Put, Status, BodyParams, Inject } from "@tsed/common";
// import { MultipartFile } from '@tsed/multipartfiles';
// import { Summary } from '@tsed/swagger';
// import { audioEntityTypes } from '../Models/AudioEntities';
// import { LoopSchema as Loop } from '../models/LoopSchema';
// import { MongooseModel } from '@tsed/mongoose';
// import { Model } from 'mongoose';

// interface fileUploadProps {
//   entityId: string;
//   entityType: audioEntityTypes;
// }

// const entityTypeTable = {
//   Loop
// }

// @Controller("/files")
// // @UseAuth
// export class FileUploadController {
//   entityTypes: {
//     [key: string]: any
//   }

//   constructor(
//     @Inject(Loop) private Loop: MongooseModel<Loop>
//   ) {
//     this.entityTypes = {
//       Loop
//     }
//   }

//   @Put("/upload/audio")
//   @Summary("Upload a new audio file")
//   @Status(200, { description: 'Success' })
//   async uploadFile(
//     @MultipartFile("fileName") file: Express.Multer.File,
//     @BodyParams() uploadProps: fileUploadProps
//     ) {
//       const entityType = uploadProps.entityType || 0;
//       const entityName = audioEntityTypes[entityType] || 'Loop';
//       const entity = this.entityTypes[entityName];
//       entity.
//     }
//   }

// }
