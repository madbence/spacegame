import { createStore } from 'redux';

export default createStore((state, action) => {
  switch(action.type) {
    case 'ADD_MESSAGE':
    const s = {
      messages: state.messages.concat([{
        text: action.message,
      }]),
    };
    console.log(state, s);
    return s;
  }
  return state;
}, {
  messages: [{
    author: 'Teszt Elek',
    text: 'Hello world!',
  }, {
    author: 'Gipsz Jakab',
    text: 'Heló világ!',
  }],
});
