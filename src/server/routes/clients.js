import { get } from 'koa-route';
import { list } from '../services/client';

export default get('/', function* () {
  this.body = list();
});
