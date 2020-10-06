import { Configuration, Inject } from '@tsed/di';
import {
  PlatformApplication,
  ILoggerSettings,
  ServerLoader,
  ServerSettings,
} from '@tsed/common';
import '@tsed/platform-express'; // /!\ keep this import
import { GlobalAcceptMimesMiddleware } from '@tsed/platform-express';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as cors from 'cors';
import * as session from 'express-session';
import '@tsed/ajv';
import '@tsed/swagger';
import '@tsed/mongoose';
import '@tsed/multipartfiles';
import { GraphQLSettings } from '@tsed/graphql';
import mongooseConfig from './config/mongoose';
import { NotFoundMiddleware } from './middlewares/NotFoundMiddleware';
import { resolve } from 'path';
import { AuthenticationError } from 'apollo-server-express';

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ['application/json', 'multipart/form-data'],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mount: {
    '/rest': [`${rootDir}/controllers/**/*.ts`],
    '/pngs': [`${rootDir}/controllers/PngsController.ts`],
  },
  componentsScan: ['${rootDir}/graphql/**/*.ts'],
  swagger: [
    {
      path: '/docs',
    },
  ],
  graphql: {
    server1: {
      path: '/graphql',
      buildSchemaOptions: {
        emitSchemaFile: true,
        authChecker: ({ root, args, context }, roles) => {
          const { user, logger, isAuthenticated } = context;
          logger.info('Auth checker: ', {
            root,
            args,
            context,
            roles,
          });

          if (!isAuthenticated()) {
            throw new AuthenticationError('Not authenticated');
          }

          if (roles && roles.length) {
            const authorized = roles.some((role) => user.roles.includes(role));
            if (!authorized) {
              return false;
            }
          }

          return true;
        },
      },
      serverConfig: {
        context: ({ req }) => ({
          user: req.user,
          isAuthenticated: req.isAuthenticated,
          logger: req.logger,
        }),
      },
    },
  },
  logger: <ILoggerSettings>{
    debug: true,
    level: 'debug',
  },
  mongoose: mongooseConfig,
  exclude: ['**/*.spec.ts'],
  multer: {
    dest: `${rootDir}/../fileStore`,
  },
  passport: {},
  pngs: {
    storagePath: `${rootDir}/../fileStore/pngs`,
    roundSizes: [300, 600],
  },
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit() {
    this.app
      .use(cors())
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      )
      .use(
        // @ts-ignore
        session({
          secret: 'mysecretkey',
          resave: true,
          saveUninitialized: true,
          cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: undefined,
          },
        })
      );

    return null;
  }

  public $afterRoutesInit() {
    this.app.use(NotFoundMiddleware);
  }
}
