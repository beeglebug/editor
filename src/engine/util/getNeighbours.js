export function getNeighbours(tiles, width, height, x, y) {
  const neighbours = [];
  const ix = y * width + x;

  // above
  if (y > 0) {
    neighbours.push(tiles[ix - width]);
  } else {
    neighbours.push(null);
  }

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

  // below
  if (y < height - 1) {
    neighbours.push(tiles[ix + width]);
  } else {
    neighbours.push(null);
  }

  return neighbours;
}

export function getSurrounding(tiles, width, height, x, y) {
  const surrounding = [];
  const ix = y * width + x;

  // above
  if (y > 0) {
    if (x > 0) {
      surrounding.push(tiles[ix - width - 1]);
    } else {
      surrounding.push(null);
    }

    surrounding.push(tiles[ix - width]);

    if (x < width - 1) {
      surrounding.push(tiles[ix - width + 1]);
    } else {
      surrounding.push(null);
    }
  } else {
    surrounding.push(null, null, null);
  }

  // left
  if (x > 0) {
    surrounding.push(tiles[ix - 1]);
  } else {
    surrounding.push(null);
  }

  // center
  surrounding.push(tiles[ix]);

  // right
  if (x < width - 1) {
    surrounding.push(tiles[ix + 1]);
  } else {
    surrounding.push(null);
  }

  // below
  if (y < height - 1) {
    if (x > 0) {
      surrounding.push(tiles[ix + width - 1]);
    } else {
      surrounding.push(null);
    }

    surrounding.push(tiles[ix + width]);

    if (x < width - 1) {
      surrounding.push(tiles[ix + width + 1]);
    } else {
      surrounding.push(null);
    }
  } else {
    surrounding.push(null, null, null);
  }

  return surrounding;
}
