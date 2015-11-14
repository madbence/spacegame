/* @flow */
type cb = () => any;
const noop = () => {};

export default (code: number, down: cb  = noop, up: cb = noop, preventDefault: bool = false) => {
  let pressed = false;
  const onDown = e => {
    if (e.keyCode !== code || pressed) {
      return;
    }
    pressed = true;
    down();
    if (preventDefault) {
      e.preventDefault();
    }
  };
  const onUp = e => {
    if (e.keyCode !== code || !pressed) {
      return;
    }
    pressed = false;
    up();
    if (preventDefault) {
      e.preventDefault();
    }
  };

  document.body.addEventListener('keydown', onDown);
  document.body.addEventListener('keyup', onUp);
}
