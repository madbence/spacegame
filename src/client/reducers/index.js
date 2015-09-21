export default (state, action) => {
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
}
