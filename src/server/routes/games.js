import { get } from 'koa-route';
import { list } from '../services/game';

export default get('/', function* () {
  this.body = list();
});
