import {
  sub,
  length,
  scale,
} from '../../shared/util/vector';

export default (ctx, scene, viewport) => {
  ctx.save();
  ctx.translate(-400, 150);
  ctx.rotate(viewport.orientation);
  ctx.scale(-1, -1);
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.clip();
  ctx.save();
  const dx = viewport.position.x * 0.05 % 10;
  const dy = viewport.position.y * 0.05 % 10;
  ctx.strokeStyle = 'gray';
  for (let x = -50; x <= 50; x += 10) {
    ctx.beginPath();
    ctx.moveTo(dx + x, -50);
    ctx.lineTo(dx + x, 50);
    ctx.stroke();
  }
  for (let y = -50; y <= 50; y += 10) {
    ctx.beginPath();
    ctx.moveTo(-50, dy + y);
    ctx.lineTo(50, dy + y);
    ctx.stroke();
  }
  ctx.restore();
  for (const ship of scene.ships) {
    let diff = scale(sub(viewport.position, ship.position), 0.05);
    if (length(diff) > 50) {
      diff = scale(diff, 1 / length(diff) * 50);
    }
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};
