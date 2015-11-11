import { get } from 'koa-route';
import config from '../../../config';

const conf = {
  ws: {
    url: config.ws.url,
  },
};

const spa =
`<!doctype html>
<meta charset=utf-8 />
<link rel=stylesheet href=style.css />
<title>SpaceGame</title>
<div id=mount></div>
<script>window.__CONFIG__ = ${JSON.stringify(conf)}</script>
<script src=bundle.js></script>`;

export default get('/', function* () {
  this.body = spa;
});
