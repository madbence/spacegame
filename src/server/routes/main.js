import { get } from 'koa-route';

export default get('/', function* () {
  this.body = '<link rel=stylesheet href=style.css /><div id=mount></div><script src=bundle.js></script>';
});
