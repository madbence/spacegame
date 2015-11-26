import renderLoadScreen from './load';
import renderShip from './ship';
import renderProjectile from './projectile';

export default (ctx, scene, viewport) => {
  ctx.save();
  ctx.clearRect(0, 0, 1000, 500);
  ctx.translate(500.5, 250.5);
  if (!scene) {
    renderLoadScreen(ctx);
    ctx.restore();
    return;
  }
  ctx.scale(1, -1);
  ctx.rotate(-viewport.orientation);
  ctx.scale(viewport.scale, viewport.scale);
  ctx.translate(-viewport.position.x, -viewport.position.y);

  ctx.save();
  ctx.strokeStyle = 'gray';
  ctx.beginPath();
  for (let x = -500; x <= 500; x += 20) {
    ctx.moveTo(x, -500);
    ctx.lineTo(x, 500);
  }
  for (let y = -500; y <= 500; y += 20) {
    ctx.moveTo(-500, y);
    ctx.lineTo(500, y);
  }
  ctx.stroke();
  ctx.restore();

  for (const ship of scene.ships) {
    renderShip(ctx, ship, viewport);
  }

  for (const projectile of scene.projectiles) {
    renderProjectile(ctx, projectile);
  }
  if (!viewport.alive) {
    ctx.save();
    ctx.font = '72px Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.baseLine = 'middle';
    ctx.scale(1, -1);
    ctx.fillText('You\'re dead!  ͡° ͜ʖ ͡°', 0, 0);
    ctx.restore();
  }
  ctx.restore();
};
