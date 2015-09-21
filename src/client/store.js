import { createStore } from 'redux';
import reducer from 'client/reducers';

export default createStore(reducer, {
  messages: [{
    author: 'Teszt Elek',
    text: 'Hello world!',
  }, {
    author: 'Gipsz Jakab',
    text: 'Heló világ!',
  }],
});
