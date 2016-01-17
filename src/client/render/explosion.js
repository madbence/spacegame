export default (ctx, scene, explosion) => {
  if (explosion.ttl < 0) {
    return;
  }
  const progress = (explosion.init - explosion.ttl) / explosion.init;
  ctx.save();
  ctx.fillStyle = `rgba(255, 0, 0, ${0.5 - progress / 2})`;
  ctx.translate(explosion.position.x, explosion.position.y);
  ctx.beginPath();
  ctx.arc(0, 0, progress * 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};
