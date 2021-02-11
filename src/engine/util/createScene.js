import { Scene, Fog, Color, AmbientLight } from 'three';

// @TODO from config
export default function createScene() {
  const scene = new Scene();
  scene.background = new Color('#000000');
  scene.fog = new Fog(scene.background, 0, 80);

  const light = new AmbientLight(new Color('#ffffff'));
  scene.add(light);

  return scene;
}
