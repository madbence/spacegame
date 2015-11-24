export default ctx => {
  ctx.save();
  ctx.font = '72px Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.baseLine = 'middle';
  ctx.translate(500, 250);
  ctx.fillText('Loading...', 0, 0);
  ctx.restore();
};
