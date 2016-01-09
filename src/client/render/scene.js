import renderLoadScreen from './load';
import renderShip from './ship';
import renderProjectile from './projectile';
import renderCrosshair from './crosshair';
import renderSpace from './space';
import renderMap from './map';
import renderScores from './scores';
import renderExplosion from './explosion';

function renderObjects(ctx, scene, particles, viewport) {
  ctx.save();
  ctx.scale(1, -1);
  ctx.rotate(-viewport.orientation);
  ctx.scale(viewport.scale, viewport.scale);
  ctx.translate(-viewport.position.x, -viewport.position.y);

  renderSpace(ctx, viewport, particles);
  for (const ship of scene.ships) {
    renderShip(ctx, ship, viewport);
  }
  for (const projectile of scene.projectiles) {
    renderProjectile(ctx, projectile);
  }
  for (const explosion of scene.explosions) {
    renderExplosion(ctx, scene, explosion);
  }

  ctx.restore();
}

function renderHUD(ctx, scene, viewport) {
  ctx.save();
  if (!viewport.alive) {
    ctx.save();
    ctx.font = '72px Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.baseLine = 'middle';
    ctx.fillText('You\'re dead!  ͡° ͜ʖ ͡°', 0, 0);
    ctx.restore();
  } else {
    renderCrosshair(ctx, viewport);
    renderMap(ctx, scene, viewport);
  }
  renderScores(ctx, scene);
  ctx.restore();
}

export default (ctx, scene, particles, viewport) => {
  ctx.save();
  ctx.clearRect(0, 0, 1000, 500);
  ctx.translate(500.5, 250.5);
  if (!scene) {
    renderLoadScreen(ctx);
    ctx.restore();
    return;
  }

  renderObjects(ctx, scene, particles, viewport);
  renderHUD(ctx, scene, viewport);
  ctx.restore();
};
