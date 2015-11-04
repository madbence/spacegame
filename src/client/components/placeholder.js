import React from 'react';

export default props => (
  <div id='placeholder'>
    <h1>404 - Not found</h1>
    <img src={`/images/placeholder-${props.image || 'not-found'}.jpg`} />
  </div>
)
