import CollisionResponse from './collision/CollisionResponse';
import collideCircleRect from './collision/collideCircleRect';
import Rect from './geometry/Rect';
import Circle from './geometry/Circle';
import collideCircleCircle from './collision/collideCircleCircle';

export default class PhysicsManager {
  colliders = [];
  tilemap = null;
  _response = new CollisionResponse();

  setTileMap(tiles) {
    this.tilemap = this.tilemap;
  }

  setColliders(colliders) {
    this.colliders = colliders;
  }

  addColliders(colliders) {
    this.colliders.push(...colliders);
  }

  clearColliders() {
    this.colliders = [];
  }

  getColliders(player) {
    // TODO filter by player position
    return this.colliders;
  }

  collide(target, colliders, onCollision) {
    this._response.reset();

    for (const collider of colliders) {
      const collisionFn = getCollisionFn(target, collider);

      if (collisionFn(target, collider, this._response)) {
        this._response.target = collider;
        onCollision(this._response);
      }
    }
  }
}

// TODO currently assumes target is always a circle
const getCollisionFn = (target, obstacle) => {
  if (obstacle instanceof Rect) return collideCircleRect;
  if (obstacle instanceof Circle) return collideCircleCircle;
};
