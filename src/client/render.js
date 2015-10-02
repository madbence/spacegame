const ctx = document.getElementById('canvas').getContext('2d');

export default function render(store) {
  const state = store.getState();
  ctx.save();
  ctx.clearRect(0, 0, 500, 500);
  ctx.translate(250.5, 250.5);

  // for each ship
  for (const ship of state.ships) {
    // draw hull
    ctx.translate(ship.pos.x, ship.pos.y);
    ctx.rotate(ship.rot);
    ctx.fillRect(-5, -10, 10, 20);

    // draw main thruster if necessary
    if (ship.thrust) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(-2.5, -20, 5, 10);
      ctx.restore();
    }

    // draw rotational thrusters if necessary
    if (ship.rotThrust < 0) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(2.5, -7.5, 5, 5);
      ctx.fillRect(-7.5, 2.5, 5, 5);
      ctx.restore();
    }
    if (ship.rotThrust > 0) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.fillRect(-7.5, -7.5, 5, 5);
      ctx.fillRect(2.5, 2.5, 5, 5);
      ctx.restore();
    }
  }
  ctx.restore();
}
