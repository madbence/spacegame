export default (ctx, projectile) => {
  ctx.save();
  ctx.translate(projectile.position.x, projectile.position.y);
  ctx.rotate(projectile.orientation);
  ctx.fillStyle = 'rgba(0, 128, 0, 0.5)';
  ctx.fillRect(-2.5, -5, 5, 10);
  ctx.restore();
};
