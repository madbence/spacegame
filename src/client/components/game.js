import React from 'react';

export default props => (
  <div id='game'>
    <canvas id='canvas' width='1000' height='500'>
      Canvas not supported! :-(
    </canvas>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
)
