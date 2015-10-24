import WS from 'ws';

let client;

function send(type, payload, meta) {
  const message = JSON.stringify({
    type,
    payload,
    meta,
  });

  client.send(message);
}

export default store => next => action => {
  if (action.meta && action.meta.pending) {
    if (!client) {
      client = WS('ws://localhost:3000');
      client.onmessage = event => {
        const action = JSON.parse(event.data);
        store.dispatch(action);
      };
    }
    return send(action.type, action.payload, action.meta);
  }
  return next(action);
};
