export default function getNeighbours(tiles, width, height, x, y) {
  const neighbours = [];
  const ix = y * width + x;

  // left
  if (x > 0) {
    neighbours.push(tiles[ix - 1]);
  } else {
    neighbours.push(null);
  }

  // right
  if (x < width - 1) {
    neighbours.push(tiles[ix + 1]);
  } else {
    neighbours.push(null);
  }

  // above
  if (y > 0) {
    neighbours.push(tiles[ix - width]);
  } else {
    neighbours.push(null);
  }

  // below
  if (y < height - 1) {
    neighbours.push(tiles[ix + width]);
  } else {
    neighbours.push(null);
  }

  return neighbours;
}
