/* @flow */

import type {
  Action,
  State,
} from '../../../types';

type Reducer = (state: State, action: Action) => State;

export function combine(...reducers: Array<Reducer>): Reducer {
  return function (state: State, action: Action): State {
    return reducers.reduce((state, reducer) => reducer(state, action), state);
  };
}
