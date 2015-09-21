import { applyMiddleware, createStore } from 'redux';
import reducer from 'client/reducers';

const middlewares = [
  () => next => action => {
    console.log(action)
    return next(action);
  }
];

export default applyMiddleware(...middlewares)(createStore)(reducer, {
  messages: [{
    author: 'Teszt Elek',
    text: 'Hello world!',
  }, {
    author: 'Gipsz Jakab',
    text: 'Heló világ!',
  }],
});
