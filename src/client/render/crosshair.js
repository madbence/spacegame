export default ctx => {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
  ctx.translate(0, -150);
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.moveTo(-7, 0);
  ctx.lineTo(7, 0);
  ctx.moveTo(0, -7);
  ctx.lineTo(0, 7);
  ctx.stroke();
  ctx.restore();
};
