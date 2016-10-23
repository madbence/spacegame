import ships from '../../../common/game/ships';

function drawShip(ctx, ref, ship, player) {
  ctx.save();

  ctx.translate(ship.pos[0] * 10, ship.pos[1] * 10);

  ctx.save();
  ctx.rotate(ship.ori);
  ctx.beginPath();
  ctx.moveTo(5, 7);
  ctx.lineTo(5, -6);
  ctx.lineTo(0, -8);
  ctx.lineTo(-5, -6);
  ctx.lineTo(-5, 7);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 0, 0, .5)';
  for (const i in ships[ship.type].thrusters) {
    const thruster = ships[ship.type].thrusters[i];
    const strength = ship.thrusters[i];
    if (strength === 0) continue;
    ctx.save();
    ctx.translate(thruster.pos[0], thruster.pos[1]);
    ctx.rotate(thruster.ori);
    ctx.fillRect(-2, 0, 4, strength * -10);
    ctx.restore();
  }

  ctx.restore();

  ctx.save();
  ctx.rotate(ref.ori);
  ctx.strokeStyle = 'green';
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(ship.rot * -10, 10);
  ctx.stroke();
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.lineTo(ship.tor * -50, 15);
  ctx.fillText(`${player.name} (${player.score})`, 0, 30);
  ctx.stroke();

  ctx.fillStyle = 'red';
  ctx.fillRect(-ship.health * 20, 20, ship.health * 40, 2);
  ctx.restore();

  ctx.strokeStyle = 'green';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(ship.vel[0] * 10, ship.vel[1] * 10);
  ctx.stroke();

  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(ship.acc[0] * 50, ship.acc[1] * 50);
  ctx.stroke();

  ctx.restore();
}

function drawProjectile(ctx, projectile) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 0, 0, .5)';
  ctx.translate(projectile.pos[0] * 10, projectile.pos[1] * 10);
  ctx.rotate(projectile.ori);
  ctx.fillRect(-2, -5, 4, 10);
  ctx.restore();
}

export default function (ctx, state, id) {
  if (!state.ships.length || id == null) {
    ctx.fillText('FOOO', 100, 100);
    ctx.restore();
    return;
  }

  const s = state.ships.find(ship => ship.owner === id);

  ctx.clearRect(0, 0, 800, 600);

  ctx.save();
  ctx.translate(400, 300);

  ctx.rotate(-s.ori);
  const ll = Math.sqrt(s.vel[0] * s.vel[0] + s.vel[1] * s.vel[1]);
  const l = Math.max(.8, Math.exp(-ll / 5) * 1.5);
  ctx.scale(l, l);
  ctx.translate(s.pos[0] * -10, s.pos[1] * -10);

  for (const ship of state.ships) {
    const player = state.players.find(player => player.id === ship.owner);
    drawShip(ctx, s, ship, player);
  }
  for (const projectile of state.projectiles) {
    drawProjectile(ctx, projectile);
  }
  ctx.restore();

  const players = state.players.slice().sort((a, b) => b.score - a.score);
  for (const i in players) {
    const player = players[i];
    ctx.fillText(`${player.name}: ${player.score}`, 0, (+i + 1) * 10);
  }
}
