import { Object3D, Vector3, Vector2, Raycaster, Euler } from 'three';
import { getAxis, getButton, MouseX, MouseY } from './input/Input';
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
  speed = 0.1;
  runSpeed = 0.2;

  // an entity in front of us which we could interact with
  interactionTarget = null;

  constructor(camera, controls) {
    super();

    //this.physics = physics;
    this.camera = camera;
    //this.scene = scene;

    this.euler = new Euler(0, 0, 0, 'YXZ');

    // this.pitch = new Object3D();
    // this.pitch.position.y = this.eyeHeight;

    // this.add(this.pitch);
    // this.pitch.add(camera);

    this.add(camera);

    // this.collider = new Circle(0, 0, 0.6);

    // this.raycaster = new Raycaster();
    // this.raycaster.far = INTERACTION_RANGE;

    this.controls = controls;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  // resetRotation(y, x) {
  //   this.rotation.y = y;
  //   this.pitch.rotation.x = x;
  // }

  handleMouseInput(delta) {
    // // apply mouse movement
    // this.rotation.y -=
    //   getAxis(MouseX) * delta * this.mouseSensitivity;
    // this.pitch.rotation.x -=
    //   getAxis(MouseY) * delta * this.mouseSensitivity;

    // // clamp between straight down and straight up
    // this.pitch.rotation.x = clamp(this.pitch.rotation.x, -halfPi, halfPi);

    this.euler.setFromQuaternion(this.camera.quaternion);

    this.euler.y -= getAxis(MouseX) * 0.002;
    this.euler.x -= getAxis(MouseY) * 0.002;

    this.euler.x = clamp(this.euler.x, -halfPi, halfPi);

    this.camera.quaternion.setFromEuler(this.euler);
  }

  handleKeyboardInput(delta) {
    const moveForward = getButton(this.controls.forward);
    const moveBack = getButton(this.controls.back);
    const moveLeft = getButton(this.controls.left);
    const moveRight = getButton(this.controls.right);
    const running = getButton(this.controls.run);

    // apply damping
    // this.velocity.x -= this.velocity.x * 10.0 * delta;
    // this.velocity.z -= this.velocity.z * 10.0 * delta;

    if (moveForward || moveBack) {
      const distance =
        (moveForward - moveBack) * (running ? this.runSpeed : this.speed);
      this.velocity.setFromMatrixColumn(this.camera.matrix, 0);
      this.velocity.crossVectors(this.camera.up, this.velocity);
      this.camera.position.addScaledVector(this.velocity, distance);
    }
    if (moveLeft || moveRight) {
      const distance =
        (moveRight - moveLeft) * (running ? this.runSpeed : this.speed);
      this.velocity.setFromMatrixColumn(this.camera.matrix, 0);
      this.camera.position.addScaledVector(this.velocity, distance);
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

    //this.handlePhysics();
    //this.handleInteraction(nearbyEntities);
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

    if (this.interactionTarget && getButtonDown(this.controls.interact)) {
      this.interactionTarget.interact(this);
    }
  }
}
