// remote actions initiated by client
export const FIRE_WEAPON = 'fire-weapon';
export const SET_THRUST = 'set-thrust';
export const JOIN_GAME = 'join-game';

// actions initiated by server
export const CLIENT_INIT = 'client-init';
export const JOIN_PLAYER = 'join-player';
export const SYNC_GAME = 'sync-game';
export const HEARTBEAT = 'beat';

// collection for validation
export const validGameActions = [
  FIRE_WEAPON,
  SET_THRUST,
  JOIN_PLAYER,
  SYNC_GAME,
  HEARTBEAT,
];

// action creators
export const fireWeapon = () => ({
  type: FIRE_WEAPON,
  payload: {},
  meta: {
    pending: true,
  },
});

export const setThrust = (thrusterIndex, strength) => ({
  type: SET_THRUST,
  payload: {
    thrusterIndex,
    strength,
  },
  meta: {
    pending: true,
  },
});

export const joinGame = (name) => ({
  type: JOIN_GAME,
  payload: {
    name,
  },
  meta: {
    pending: true,
  },
});

export const clientInit = (id) => ({
  type: CLIENT_INIT,
  payload: {
    id,
  },
  meta: {},
});

export const joinPlayer = (clientid, name) => ({
  type: JOIN_PLAYER,
  payload: {
    client: clientid,
    name,
  },
  meta: {},
});

export const syncGame = (gamestate) => ({
  type: SYNC_GAME,
  payload: gamestate,
  meta: {},
});

export const heartbeat = () => ({
  type: HEARTBEAT,
  payload: {},
  meta: {},
});
