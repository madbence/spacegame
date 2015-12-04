export default (ctx, particles) => {
  ctx.save();
  ctx.strokeStyle = 'gray';
  for (const particle of particles) {
    ctx.beginPath();
    ctx.fillRect(particle.position.x, particle.position.y, 2, 2);
    ctx.stroke();
  }
  ctx.restore();
}
