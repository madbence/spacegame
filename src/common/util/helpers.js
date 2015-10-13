export function combine(...reducers) {
  return function (state: State, action: Action): State {
    return reducers.reduce((state, reducer) => reducer(state, action), state);
  };
}

export function combineProps(reducers) {
  return function (state, action) {
    return Object.keys(reducers).reduce((state, prop) => ({...state, [prop]: reducers[prop](state[prop], action)}), state);
  };
}

export function createReducer(initial, reducers) {
  return function (state = initial, action) {
    if (reducers[action.type]) {
      return reducers[action.type](state, action);
    }
    return state;
  }
}
