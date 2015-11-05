import koa from 'koa';
import http from 'http';
import { get } from 'koa-route';
import mount from 'koa-mount';
import assets from './routes/assets';
import {readFile} from 'fs';

const app = koa();

var asyncReadFile = src => {
	return new Promise((resolve, reject) => {
		readFile(src, {"encoding" : "utf8"}, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		});
	});
}

app

  // serve assets (css, js, etc...)
  .use(mount(assets))

  // serve main page, it's nothing fancy
  // this should be definitely improved :)
  .use(get('/', function* () {
    this.body = yield asyncReadFile("./assets/index.html");
  }));

export default app;
