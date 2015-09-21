export default (state, action) => {
  switch(action.type) {
    case 'ADD_MESSAGE':
    const s = {
      messages: state.messages.concat([{
        text: action.message,
      }]),
    };
    return s;
  }
  return state;
}
