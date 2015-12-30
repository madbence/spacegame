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

export function updateAt<T>(xs: Array<T>, index: number, modification: any): Array<T> {
  return [...xs.slice(0, index), { ...xs[index], ...modification }, ...xs.slice(index + 1)];
}
