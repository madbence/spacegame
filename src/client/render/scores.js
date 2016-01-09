export default (ctx, scene) => {
  ctx.save();
  ctx.translate(400, -200);
  const players = scene.players.slice().sort((a, b) => b.score - a.score);
  for (const player of players) {
    ctx.fillText(`${player.name}: ${player.score}`, 0, 0);
    ctx.translate(0, 20);
  }
  ctx.restore();
};
