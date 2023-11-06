export type Point = [number, number]

export function getPointAngle(start: Point, point: Point) {
  const [startX, startY] = start
  const [x, y] = point
  const deltaX = x - startX
  const deltaY = y - startY
  const rad = Math.atan2(deltaY, deltaX)
  const deg = rad * (180 / Math.PI)
  return deg
}
