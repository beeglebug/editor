import { Object3D, Vector3, Vector2, Raycaster, Euler } from 'three';
import { getAxis, getButton, MouseX, MouseY } from './input/Input';
import clamp from './maths/clamp';
import Circle from './physics/geometry/Circle';
import Physics from './physics';
import { TILE_SIZE } from './consts';
import useStore, { sceneSelector } from '../editor/store';
import { getSurrounding } from './util/getNeighbours';

const halfPi = Math.PI / 2;
const screenCenter = new Vector2();

const INTERACTION_RANGE = 3;

export default class CharacterController extends Object3D {
  enabled = false;
  eyeHeight = 1.5;
  velocity = new Vector3();
  direction = new Vector3();
  euler = new Euler(0, 0, 0, 'YXZ');
  _direction = new Vector3();
  onFloor = true;
  collider = null;
  mouseSensitivity = 0.6;
  speed = 1.5;
  runSpeed = 3;

  // an entity in front of us which we could interact with
  interactionTarget = null;

  constructor(camera, controls) {
    super();

    camera.position.set(0, this.eyeHeight, 0);
    this.add(camera);
    this.camera = camera;

    // this.collider = new Circle(0, 0, 0.6);

    // this.raycaster = new Raycaster();
    // this.raycaster.far = INTERACTION_RANGE;

    this.controls = controls;

    window.controller = this;
  }

  handleMouseInput(delta) {
    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= getAxis(MouseX) * delta;
    this.euler.x -= getAxis(MouseY) * delta;
    this.euler.x = clamp(this.euler.x, -halfPi, halfPi);

    this.camera.quaternion.setFromEuler(this.euler);
  }

  getForwardVector() {
    this.camera.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();
    return this._direction;
  }

  getSideVector() {
    this.camera.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();
    this._direction.cross(this.camera.up);
    return this._direction;
  }

  handleKeyboardInput(delta) {
    const movingForward = getButton(this.controls.forward);
    const movingBack = getButton(this.controls.back);
    const movingLeft = getButton(this.controls.left);
    const movingRight = getButton(this.controls.right);
    const running = getButton(this.controls.run);

    if (!this.onFloor) return;

    const speed = running ? this.runSpeed : this.speed;

    if (movingForward) {
      this.velocity.add(this.getForwardVector().multiplyScalar(speed * delta));
    }

    if (movingBack) {
      this.velocity.add(this.getForwardVector().multiplyScalar(-speed * delta));
    }

    if (movingLeft) {
      this.velocity.add(this.getSideVector().multiplyScalar(-speed * delta));
    }

    if (movingRight) {
      this.velocity.add(this.getSideVector().multiplyScalar(speed * delta));
    }
  }

  handlePhysics() {
    // copy position to the collider
    this.collider.x = this.position.x;
    this.collider.y = this.position.z;

    // get nearby
    const colliders = this.physics.getColliders(this);

    this.physics.collide(this.collider, colliders, this.onCollision);

    // handled in 2d with collider
    const tx = Math.floor(this.position.x / TILE_SIZE);
    const ty = Math.floor(this.position.z / TILE_SIZE);
    const ix = tx * this.scene.width + ty;
    const tile = this.scene.tiles[ix];

    let y = this.eyeHeight;
    if (tile) {
      y += tile.floor;
    }

    // update the player controller based on the collider
    this.position.set(this.collider.x, y, this.collider.y);
  }

  onCollision = (response) => {
    const { mtd } = response;
    this.collider.x += mtd.x;
    this.collider.y += mtd.y;
  };

  update(delta, nearbyEntities) {
    if (!this.enabled) return;

    this.handleMouseInput(delta);
    this.handleKeyboardInput(delta);

    const GRAVITY = 0.1;

    if (this.onFloor) {
      // apply damping
      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;
    } else {
      this.velocity.y -= GRAVITY * delta;
    }

    this.position.add(this.velocity);

    const state = useStore.getState();
    const tx = Math.floor(this.position.x / TILE_SIZE);
    const ty = Math.floor(this.position.z / TILE_SIZE);

    state.setPlayerPosition(this.position.x, this.position.y, this.position.z);
    state.setPlayerTilePosition(tx, ty);

    const surrounding = this.getSurroundingTiles(tx, ty);

    // center
    const onTile = surrounding[4];

    if (this.position.y > onTile.floor) {
      this.onFloor = false;
    }

    if (this.position.y < onTile.floor) {
      this.onFloor = true;
      this.position.y = onTile.floor;
    }

    // this.collider.position.add(this.velocity)
    // this.handlePhysics();
    // this.position.set(this.collider.position)

    //this.handleInteraction(nearbyEntities);
  }

  getSurroundingTiles(tx, ty) {
    const state = useStore.getState();
    const scene = sceneSelector(state);
    return getSurrounding(scene.tiles, scene.width, scene.height, tx, ty);
  }

  // handleInteraction(nearbyEntities) {
  //   this.raycaster.setFromCamera(screenCenter, this.camera);

  //   const interactiveEntities = nearbyEntities.filter(
  //     (entity) => entity.interactive,
  //   );

  //   const intersections = this.raycaster.intersectObjects(interactiveEntities);

  //   if (intersections.length) {
  //     const closest = intersections[0];

  //     // the target is the parent Entity
  //     this.interactionTarget = closest.object.parent;
  //   } else {
  //     this.interactionTarget = null;
  //   }

  //   if (this.interactionTarget && getButtonDown(this.controls.interact)) {
  //     this.interactionTarget.interact(this);
  //   }
  // }
}
