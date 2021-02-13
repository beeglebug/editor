import { Object3D, Vector3, Vector2, Raycaster } from 'three';
import Input from './input/Input';
import clamp from './maths/clamp';
import Circle from './physics/geometry/Circle';
import Physics from './physics';
import { TILE_SIZE } from './consts';

const halfPi = Math.PI / 2;
const screenCenter = new Vector2();

const INTERACTION_RANGE = 3;

export default class CharacterController extends Object3D {
  enabled = false;
  eyeHeight = 1.5;
  velocity = new Vector3();
  direction = new Vector3();

  collider = null;
  mouseSensitivity = 0.6;
  speed = 100;
  runSpeed = 200;

  // an entity in front of us which we could interact with
  interactionTarget = null;

  constructor({ camera, controls, physics, scene }) {
    super();

    this.physics = physics;
    this.camera = camera;
    this.scene = scene;

    this.pitch = new Object3D();
    this.pitch.position.y = this.eyeHeight;

    this.add(this.pitch);
    this.pitch.add(camera);

    this.collider = new Circle(0, 0, 0.6);

    this.raycaster = new Raycaster();
    this.raycaster.far = INTERACTION_RANGE;

    this.controls = controls;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  resetRotation(y, x) {
    this.rotation.y = y;
    this.pitch.rotation.x = x;
  }

  handleMouseInput(delta) {
    // apply mouse movement
    this.rotation.y -=
      Input.getAxis(Input.MouseX) * delta * this.mouseSensitivity;
    this.pitch.rotation.x -=
      Input.getAxis(Input.MouseY) * delta * this.mouseSensitivity;

    // clamp between straight down and straight up
    this.pitch.rotation.x = clamp(this.pitch.rotation.x, -halfPi, halfPi);
  }

  handleKeyboardInput(delta) {
    const moveForward = Input.getButton(this.controls.forward);
    const moveBack = Input.getButton(this.controls.back);
    const moveLeft = Input.getButton(this.controls.left);
    const moveRight = Input.getButton(this.controls.right);
    const running = Input.getButton(this.controls.run);

    // apply damping
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    this.direction.z = moveForward - moveBack;
    this.direction.x = moveLeft - moveRight;
    this.direction.normalize();

    const z = this.direction.z * (running ? this.runSpeed : this.speed);
    const x = this.direction.x * (running ? this.runSpeed : this.speed);

    if (moveForward || moveBack) this.velocity.z -= z * delta;
    if (moveLeft || moveRight) this.velocity.x -= x * delta;
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

    this.translateX(this.velocity.x * delta);
    this.translateZ(this.velocity.z * delta);

    this.handlePhysics();

    this.handleInteraction(nearbyEntities);
  }

  handleInteraction(nearbyEntities) {
    this.raycaster.setFromCamera(screenCenter, this.camera);

    const interactiveEntities = nearbyEntities.filter(
      (entity) => entity.interactive,
    );

    const intersections = this.raycaster.intersectObjects(interactiveEntities);

    if (intersections.length) {
      const closest = intersections[0];

      // the target is the parent Entity
      this.interactionTarget = closest.object.parent;
    } else {
      this.interactionTarget = null;
    }

    if (this.interactionTarget && Input.getButtonDown(this.controls.interact)) {
      this.interactionTarget.interact(this);
    }
  }
}
