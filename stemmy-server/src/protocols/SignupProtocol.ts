import { Strategy } from 'passport-local';
import { OnInstall, OnVerify, Protocol } from '@tsed/passport';
import { BodyParams, Req, Email } from '@tsed/common';
import { Forbidden } from '@tsed/exceptions';
import { UserSignup } from '../models/UserSignup';
import { UsersService } from '../services/UsersService';

@Protocol({
  name: 'signup',
  useStrategy: Strategy,
  settings: {
    usernameField: 'email',
    passwordField: 'password',
  },
})
export class SignupProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {}

  async $onVerify(@Req() request: Req, @BodyParams() user: UserSignup) {
    const { email } = user;
    const found = await this.usersService.findOne({ email });

    if (found) {
      throw new Forbidden('Email is already registered');
    }

    return this.usersService.create(user);
  }

  $onInstall(strategy: Strategy): void {}
}
