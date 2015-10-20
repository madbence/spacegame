import game from '../common/game';
import { join } from './services/game';
import { create } from './services/client';

export default socket => {
  const client = create(socket);
  const game = join(client);
}
