import type { INestApplication } from '@nestjs/common';
import { NotFoundFilter } from './shared/adapters/not-found.filter.js';

/** HTTP setup shared by the server and the route tests, so tests run the real composition. */
export function configureHttp(app: INestApplication, webOrigin: string): void {
  app.enableCors({ origin: webOrigin });
  app.useGlobalFilters(new NotFoundFilter());
}
