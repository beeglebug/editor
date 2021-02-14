import {
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  TextureLoader,
  NearestFilter,
} from 'three';
import CharacterController from './CharacterController';
import Input from './input/Input';
import loop from './loop';
// import createContent from './createContent';
// import loadAssets from './loadAssets';
import PhysicsManager from './physics';
// import renderReticle from './2d/renderReticle';
import createScene from './util/createScene';
import createCanvas from './util/createCanvas';
// import createUI from './ui';
// import { START_DIALOGUE, STOP_DIALOGUE } from './events';
import KeyCode from './input/KeyCode';
import createContent from './util/createContent';
import EventEmitter from 'eventemitter3';

export default class Engine extends EventEmitter {
  constructor(container, width, height, scale) {
    super();
    this.container = container;
    //this.container.style.position = 'relative';
    //this.container.style.width = `${width}px`;
    //this.container.style.height = `${height}px`;

    // setup dom
    this.canvas3d = createCanvas(width, height, scale);
    this.canvas3d.tabIndex = 1; // needed for keyboard input

    this.canvas2d = createCanvas(width, height, scale);

    this.ctx = this.canvas2d.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // const element = createUI(this);

    this.container.appendChild(this.canvas3d);
    this.container.appendChild(this.canvas2d);
    // this.container.appendChild(element);

    this.setupPointerLock();

    this.scene = createScene();
    this.renderer = new WebGLRenderer({ canvas: this.canvas3d });
    this.camera = new PerspectiveCamera(45, width / height, 0.1, 1000);

    // TODO from config
    this.controls = {
      forward: Input.createButton('forward', KeyCode.W, KeyCode.UpArrow),
      back: Input.createButton('back', KeyCode.S, KeyCode.DownArrow),
      left: Input.createButton('left', KeyCode.A, KeyCode.LeftArrow),
      right: Input.createButton('right', KeyCode.D, KeyCode.RightArrow),
      interact: Input.createButton('interact', KeyCode.E),
      run: Input.createButton('run', KeyCode.LeftShift),
    };

    this.physics = new PhysicsManager();

    this.controller = new CharacterController(this);
    this.scene.add(this.controller);

    // // bind stuff via events
    // this.addListener(START_DIALOGUE, () => {
    //   this.controller.disable();
    // });

    // this.addListener(STOP_DIALOGUE, () => {
    //   this.controller.enable();
    // });
  }

  load(game) {
    this.clear();

    this.world = new Object3D();

    const scene = game.scenes[0];

    this.controller.scene = scene;

    const assets = loadAssets(scene);
    const [tiles, entities] = createContent(scene, assets, this);

    if (tiles.length) this.world.add(...tiles);
    if (entities.length) this.world.add(...entities);

    const entityColliders = entities
      .filter((obj) => obj.collider)
      .map((obj) => obj.collider);

    const tileColliders = tiles
      .filter((obj) => obj.collider)
      .map((obj) => obj.collider);

    // TODO handle colliders separately to allow for easy broadphase on tiles
    this.physics.setColliders([...entityColliders, ...tileColliders]);

    this.tiles = tiles;
    this.entities = entities;

    this.scene.add(this.world);

    //
    this.controller.position.set(...scene.spawn.position);
    this.controller.rotation.set(...scene.spawn.rotation);

    window.controller = this.controller;

    // this.controller.resetRotation(Math.PI, 0);

    this.controller.handlePhysics(); // force update the 2d collider
  }

  start() {
    Input.bind(this.canvas3d);
    this.canvas3d.focus();
    this.canvas3d.requestPointerLock();
    this.cancelLoop = loop(this.tick);
    this.emit('start');
  }

  stop() {
    Input.unbind(this.canvas3d);
    this.cancelLoop();
    this.emit('stop');
  }

  clear() {
    this.physics.clearColliders();
    if (this.world) {
      // loop backwards to avoid mid loop splice reindexing
      for (let i = this.world.children.length - 1; i >= 0; i--) {
        this.world.remove(this.world.children[i]);
      }
    }
  }

  tick = (deltaTime) => {
    // TODO actual broadphase
    const nearbyEntities = this.entities;

    this.controller.update(deltaTime, nearbyEntities);

    this.entities.forEach((entity) => entity.update(this));

    this.render();

    Input.clear();
  };

  render() {
    this.renderer.render(this.scene, this.camera);

    // 2d rendering
    // renderReticle(this.ctx, this.controller);
  }

  // hasPointerLock() {
  //   return document.pointerLockElement === this.canvas3d;
  // }

  // setupPointerLock() {
  //   const handlePointerLockChange = () => {
  //     if (this.hasPointerLock()) {
  //       this.controller.enabled = true;
  //     } else {
  //       this.controller.enabled = false;
  //       this.stop();
  //     }
  //   };

  //   const handlePointerLockError = (error) => {
  //     console.warn('Pointer Lock Error', error);
  //     this.stop();
  //   };

  //   document.addEventListener('pointerlockchange', handlePointerLockChange);
  //   document.addEventListener('pointerlockerror', handlePointerLockError);
  // }
}
