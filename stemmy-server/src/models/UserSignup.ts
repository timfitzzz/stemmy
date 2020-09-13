import { Required, Description } from '@tsed/common';
import { Creds } from './Creds';

export class UserSignup extends Creds {
  @Description('Username')
  @Required()
  userName: string;

  @Description('Display Name')
  @Required()
  displayName: string;
}
