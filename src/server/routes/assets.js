import koa from 'koa';
import { get } from 'koa-route';
import fs from 'fs';

const app = koa();

/**
 * Create a simple static resource middleware for koa
 * @param {string} url Resource URL
 * @param {string} path Path to the actual resource
 * @param {string} type MIME-Type
 */
function serve(url: string, path: string, type: string) {

  // Create a `get` middleware that responsts to `url`
  return get(url, function* () {

    // stream the contents of `path` back to the client
    this.body = fs.createReadStream(path);
    // set `Content-Type` header
    this.type = type;
  });
}

app
  .use(serve('/bundle.js', './assets/bundle.js', 'application/javascript'))
  .use(serve('/style.css', './assets/style.css', 'text/css'))
  .use(serve('/bootstrap.css', './node_modules/bootstrap/dist/css/bootstrap.min.css'), 'text/css')
  .use(serve('/images/placeholder-signup.jpg', './assets/images/placeholder-signup.jpg', 'image/jpeg'));

export default app;
