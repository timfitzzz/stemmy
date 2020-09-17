import { Middleware, Res, Req, Next } from '@tsed/common';

@Middleware()
export class SendFileMiddleware {
  use(@Res() response: Res, @Next() next: Next) {}
}
