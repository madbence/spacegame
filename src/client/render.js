let ctx;

export default function render(store) {
  const state = store.getState();
  if (!ctx) {
    ctx = document.getElementById('canvas').getContext('2d');
  }
  ctx.save();
  ctx.clearRect(0, 0, 500, 500);
  ctx.translate(250.5, 250.5);
  ctx.scale(1, -1);

  // for each ship
  for (const ship of state.game.ships) {
    // draw hull
    ctx.save();
    ctx.translate(ship.position.x, ship.position.y);
    ctx.rotate(ship.orientation);
    ctx.fillRect(-5, -10, 10, 20);
    ctx.beginPath();
    ctx.moveTo(-5, -10);
    ctx.lineTo(-5, 10);
    ctx.lineTo(0, 15);
    ctx.lineTo(5, 10);
    ctx.lineTo(5, -10);
    ctx.fill();
    for (const thruster of ship.thrusters) {
      if (thruster.strength === 0) {
        continue;
      }
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.translate(thruster.position.x, thruster.position.y);
      ctx.rotate(thruster.orientation);
      ctx.fillRect(-2, 0, 4, Math.log(10000 * thruster.strength) * -2);
      ctx.restore();
    }
    ctx.restore();
  }

  for (const projectile of state.game.projectiles) {
    ctx.save();
    ctx.translate(projectile.position.x, projectile.position.y);
    ctx.rotate(projectile.orientation);
    ctx.fillStyle = 'green';
    ctx.fillRect(-2.5, -10, 5, 20);
    ctx.restore();
  }
  ctx.restore();
}
