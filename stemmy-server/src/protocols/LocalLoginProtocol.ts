import { Protocol, OnVerify, OnInstall } from '@tsed/passport';
import { Strategy, IStrategyOptions } from 'passport-local';
import { UsersService } from '../services/UsersService';
import { Req, BodyParams } from '@tsed/common';
import { Creds } from '../models/Creds';

@Protocol<IStrategyOptions>({
  name: 'login',
  useStrategy: Strategy,
  settings: {
    usernameField: 'email',
    passwordField: 'password',
  },
})
export class LoginLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {}

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Creds) {
    const { email, password } = credentials;

    const user = await this.usersService.findOne({ email });

    if (!user) {
      return false;
    }

    if (!user.verifyPassword(password)) {
      return false;
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {}
}
