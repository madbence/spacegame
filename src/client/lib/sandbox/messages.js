// message types
export const ACCELERATE = 'ACCELERATE';
export const FIRE = 'FIRE';
export const GETSTATE = 'GETSTATE';
export const KEYDOWN = 'KEYDOWN';
export const KEYUP = 'KEYUP';
export const NOOP = 'NOOP';
export const REGISTERKEYLISTENER = 'REGISTERKEYLISTENER';
export const SENDSTATE = 'SENDSTATE';

// message creators
export const accelerate = (thrusterIndex, strength) => ({
  type: ACCELERATE,
  payload: {
    thrusterIndex,
    strength,
  },
});

export const fire = () => ({
  type: FIRE,
  payload: {},
});

export const getState = () => ({
  type: GETSTATE,
  payload: {},
});

export const keydown = (key) => ({
  type: KEYDOWN,
  payload: {
    key,
  },
});

export const keyup = (key) => ({
  type: KEYUP,
  payload: {
    key,
  },
});

export const noop = () => ({
  type: NOOP,
  payload: {},
});

export const registerKeyListener = (code, preventDefault) => ({
  type: REGISTERKEYLISTENER,
  payload: {
    code,
    preventDefault,
  },
});

export const sendState = (state) => ({
  type: SENDSTATE,
  payload: state,
});
