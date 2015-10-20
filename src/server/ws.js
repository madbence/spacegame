import game from '../common/game';
import { create as createGame } from './services/game';
import { create as createClient } from './services/client';

export default socket => {
  const client = createClient(socket);
  const game = createGame();

  const unsubscribeGame = game.subscribe((action, game) => {
    client.dispatch(action.type, action.payload, { done: true }).catch(err => {
      if (err) {
        console.log(err.stack);
      }
    });
  });
  const unsubscribeClient = client.subscribe(action => {
    switch (action.type) {
      default: game.step(action); break;
    }
  });

  game.start();

  socket.on('close', () => { unsubscribeGame(); unsubscribeClient() });
}
