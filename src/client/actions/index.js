// local actions
export const CLIENT_CONNECT = 'client-connect';
export const CLIENT_DISCONNECT = 'client-disconnect';
export const NAVIGATE = 'navigate';
export const CONNECT_SOCKET = 'connect-socket';

// action creators
export const clientConnect = () => ({
  type: CLIENT_CONNECT,
  payload: {},
  meta: {},
});

export const clientDisconnect = () => ({
  type: CLIENT_DISCONNECT,
  payload: {},
  meta: {},
});

export const navigate = (route) => ({
  type: NAVIGATE,
  payload: {
    route,
  },
  meta: {},
});

export const connectSocket = () => ({
  type: CONNECT_SOCKET,
  payload: {},
  meta: {}
});
