import {
  BodyParams,
  Controller,
  Post,
  ProviderScope,
  Req,
  Scope,
} from '@tsed/common';
import { Authenticate } from '@tsed/passport';
import { request } from 'express';

@Controller('/auth')
@Scope(ProviderScope.SINGLETON)
export class AuthCtrl {
  @Post('/login')
  @Authenticate('login')
  login(
    @Req() req: Req,
    @BodyParams('email') email: string,
    @BodyParams('password') password: string
  ) {
    return req.user;
  }
}
