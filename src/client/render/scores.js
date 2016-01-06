export default (ctx, scene, viewport) => {
  ctx.save();
  ctx.translate(viewport.position.x, viewport.position.y);
  ctx.scale(1 / viewport.scale, 1 / viewport.scale);
  ctx.rotate(viewport.orientation);
  ctx.translate(400, 200);
  ctx.scale(1, -1);
  const players = scene.players.slice().sort((a, b) => b.score - a.score);
  for (const player of players) {
    ctx.fillText(`${player.name}: ${player.score}`, 0, 0);
    ctx.translate(0, 20);
  }
  ctx.restore();
};
