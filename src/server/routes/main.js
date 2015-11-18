import config from '../../../config';

const conf = {
  ws: {
    url: config.ws.url,
  },
  google: {
    clientId: config.google.clientId,
  },
};

const spa =
`<!doctype html>
<meta charset=utf-8 />
<link rel=stylesheet href=style.css />
<title>SpaceGame</title>
<div id=mount></div>
<script>window.__CONFIG__ = ${JSON.stringify(conf)}</script>
<script src=https://apis.google.com/js/platform.js></script>
<script src=bundle.js></script>`;

export default function* (next) {
  switch (this.url) {
    case '/':
    case '/login':
    case '/lobby':
    case '/game':
      this.body = spa;
      break;
    default:
      yield* next;
  }
}
