export default (ctx, viewport, particles) => {
  ctx.save();
  ctx.strokeStyle = 'gray';
  const offsetX = Math.floor(viewport.position.x / 2000) * 2000;
  const offsetY = Math.floor(viewport.position.y / 2000) * 2000;
  for (let i = 0; i < 4; i++) {
    const x = i % 2 * 2000;
    const y = Math.floor(i / 2) * 2000;
    ctx.beginPath();
    for (const particle of particles) {
      ctx.beginPath();
      ctx.fillRect(offsetX + x + particle.position.x, offsetY + y + particle.position.y, 2, 2);
      ctx.stroke();
    }
  }
  ctx.restore();
};
