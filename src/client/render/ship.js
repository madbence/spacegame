export default (ctx, ship, viewport) => {
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
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.translate(thruster.position.x, thruster.position.y);
    ctx.rotate(thruster.orientation);
    ctx.fillRect(-2, 0, 4, Math.log(200 * thruster.strength) * -2);
    ctx.restore();
  }

  if (ship.shield > 0) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // HUD
  ctx.save();
  ctx.rotate(-ship.orientation);
  ctx.rotate(viewport.orientation);
  ctx.save();
  ctx.fillStyle = 'green';
  ctx.fillRect(-20, 20, ship.hull * 0.4, 3);
  ctx.fillStyle = 'red';
  ctx.fillRect(-20 + ship.hull * 0.4, 20, (100 - ship.hull) * 0.4, 3);
  ctx.restore();
  ctx.save();
  ctx.rotate(Math.PI);
  ctx.scale(-1, 1);
  ctx.fillText(ship.name, -20, -25);
  ctx.restore();
  ctx.restore();

  ctx.restore();
};
