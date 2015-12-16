import { NAVIGATE } from '../actions';

export default (state = '/', action) => {
  switch (action.type) {
    case NAVIGATE: return action.payload.route;
    default: return state;
  }
};
