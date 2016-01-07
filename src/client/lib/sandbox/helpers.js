import store from '../../store';
import { setThrust, fireWeapon } from '../../../shared/actions';

export function checkSupport() {
  if (!window.Worker) {
    // TODO: figure out how to handle this
    throw new Error('Workers not supported');
  }

  window.URL = window.URL || window.webkitURL;
  if (!window.URL) {
    // TODO: figure out how to handle this
    throw new Error('URL API not supported');
  }
}

export function createBlob(code) {
  let blob;
  try {
    blob = new Blob([code], {type: 'application/javascript'});
  } catch (e) { // Backwards-compatibility
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new window.BlobBuilder();
    blob.append(code);
    blob = blob.getBlob();
  }

  return blob;
}

export function getCurrentShip() {
  const clientId = store.getState().client.id;
  const game = store.getState().game;
  if (!clientId || !game) {
    return null;
  }
  const player = game.players.filter(player => player.client === clientId)[0];
  if (!player) {
    return null;
  }
  return game.ships.filter(ship => ship.owner === player.id)[0] || null;
}

function dispatch(action) {
  const ship = getCurrentShip();
  if (!ship) {
    return;
  }

  action.payload.shipId = ship.id;
  store.dispatch(action);
}

export const accelerate = (thrusterIndex, strength) => dispatch(setThrust(thrusterIndex, strength));
export const fire = () => dispatch(fireWeapon());

// transform global state to state visible to user
export function transformState(state) {
  return state.game;
}
