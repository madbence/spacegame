export default f => {
  const state = new Map();

  document.body.addEventListener('keydown', e => {
    if (state.has(e.keyCode)) {
      return;
    }
    state.set(e.keyCode, true);
    f('down', e);
  });

  document.body.addEventListener('keyup', e => {
    if (!state.has(e.keyCode)) {
      return;
    }

    state.delete(e.keyCode);
    f('up', e);
  });
};
