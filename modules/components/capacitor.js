export function drawCapacitor(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x + 20, y - 15);
  ctx.lineTo(x + 20, y + 15);
  ctx.moveTo(x + 30, y - 15);
  ctx.lineTo(x + 30, y + 15);
  ctx.moveTo(x + 30, y);
  ctx.lineTo(x + 50, y);
  ctx.stroke();
}
