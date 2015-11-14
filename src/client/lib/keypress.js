/* @flow */
type callback = () => any;

export default (code: number, down: ?callback, up: ?callback, preventDefault: ?boolean) => {
  let pressed = false;
  const onDown = e => {
    if (e.keyCode !== code || pressed) {
      return;
    }
    pressed = true;
    if (down) {
      down();
    }
    if (preventDefault) {
      e.preventDefault();
    }
  };
  const onUp = e => {
    if (e.keyCode !== code || !pressed) {
      return;
    }
    pressed = false;
    if (up) {
      up();
    }
    if (preventDefault) {
      e.preventDefault();
    }
  };

  document.body.addEventListener('keydown', onDown);
  document.body.addEventListener('keyup', onUp);
}
