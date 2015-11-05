import type {
  Action,
  State,
} from '../../../types';

export function combine(...reducers) {
  return function (state: State, action: Action): State {
    return reducers.reduce((state, reducer) => reducer(state, action), state);
  };
}
