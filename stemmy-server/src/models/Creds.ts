import { Description, Example, Format, Required } from '@tsed/common';

export class Creds {
  @Description('User password')
  @Example('/!5a0dka/')
  @Required()
  password: string;

  @Description('User email')
  @Example('youknowwhatanemailaddresslookslike@ofc.com')
  @Format('email')
  @Required()
  email: string;
}
