export function drawInductor(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y);
  for (let i = 0; i < 4; i++) {
    ctx.arc(x + 15 + i * 10, y, 5, Math.PI, 0, false);
  }
  ctx.moveTo(x + 50, y);
  ctx.lineTo(x + 60, y);
  ctx.stroke();
}
