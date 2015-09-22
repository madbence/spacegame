export default (state, action) => {
  switch(action.type) {
    case 'ADD_MESSAGE':
    const s = {
      messages: state.messages.filter(message => message.date).concat([{
        text: action.payload.message,
        author: action.payload.author,
        date: action.payload.date
      }]),
    };
    return s;
  }
  return state;
}
