import { Middleware, Res, Next } from '@tsed/common';

@Middleware()
export class NotFoundMiddleware {
  use(@Res() response: Res, @Next() next: Next) {
    response.status(404).send('Not found');
  }
}
