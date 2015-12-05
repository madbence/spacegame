import {
  sub,
  length,
  scale,
} from '../../shared/util/vector';

export default (ctx, scene, viewport) => {
  ctx.save();
  ctx.translate(viewport.position.x, viewport.position.y);
  ctx.scale(1 / viewport.scale, 1 / viewport.scale);
  ctx.rotate(viewport.orientation);
  ctx.translate(-400, -150);
  ctx.rotate(-viewport.orientation);
  ctx.scale(-1, -1);
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  for (const ship of scene.ships) {
    let diff = scale(sub(viewport.position, ship.position), 0.05);
    if (length(diff) > 50) {
      diff = scale(diff, 1 / length(diff) * 50);
    }
    ctx.fillRect(
      diff.x - 5,
      diff.y - 5,
      10, 10
    );
  }
  ctx.restore();
};
