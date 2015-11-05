import { create as createGame } from './services/game';
import { create as createClient } from './services/client';

export default socket => {
  const client = createClient(socket);
  const game = createGame();
  client.join(game);
};
