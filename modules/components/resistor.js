export function drawResistor(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x + 15, y - 5);
  ctx.lineTo(x + 25, y + 5);
  ctx.lineTo(x + 35, y - 5);
  ctx.lineTo(x + 45, y + 5);
  ctx.lineTo(x + 50, y);
  ctx.lineTo(x + 60, y);
  ctx.stroke();
}
