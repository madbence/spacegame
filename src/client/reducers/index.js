export default (messages = [], action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
    return messages.filter(message => message.date).concat([{
      text: action.payload.message,
      author: action.payload.author,
      date: action.payload.date
    }]);
  }
  return messages;
};
