import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  DirectionalLight,
  SpotLight,
  PMREMGenerator,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  Vector2,
  Vector3,
  DoubleSide,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap, ScrollTrigger } from './core';

export async function mountGloves(canvas: HTMLCanvasElement, hero: HTMLElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.1, 4.2);

  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  const key = new SpotLight(0xffffff, 60, 0, 0.6, 0.7, 1.4);
  key.position.set(3, 5, 4);
  const rim = new DirectionalLight(0xff2140, 4);
  rim.position.set(-5, 1.5, -3);
  const fill = new DirectionalLight(0xffffff, 0.6);
  fill.position.set(-2, -2, 4);
  scene.add(key, rim, fill);

  const rig = new Group(); // mouse tilt + idle
  const punch = new Group(); // scroll-driven
  rig.add(punch);
  scene.add(rig);

  const material = new MeshPhysicalMaterial({
    color: 0xa30b23,
    roughness: 0.5,
    metalness: 0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.32,
    sheen: 0.12,
    sheenColor: 0xff4a5f,
    side: DoubleSide,
  });

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync('/models/glove.glb');
  gltf.scene.updateMatrixWorld(true);
  const src = gltf.scene.getObjectByProperty('type', 'Mesh') as Mesh;
  // bake node transform (quantized GLB keeps scale on the node) and normalise to unit height
  const geo = src.geometry.clone().applyMatrix4(src.matrixWorld);
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const size = new Vector3();
  bb.getSize(size);
  const c = new Vector3();
  bb.getCenter(c);
  geo.translate(-c.x, -c.y, -c.z);
  const k = 1 / Math.max(size.x, size.y, size.z);
  geo.scale(k, k, k);

  const right = new Mesh(geo, material);
  const left = new Mesh(geo, material);
  left.scale.x = -1;

  const S = 1.32;
  right.scale.multiplyScalar(S);
  left.scale.multiplyScalar(S);
  right.position.set(0.42, -0.02, 0);
  right.rotation.set(0.18, -0.75, 0.12);
  left.position.set(-0.42, -0.12, -0.25);
  left.rotation.set(0.1, 0.75, -0.1);
  punch.add(right, left);

  // frame gloves on the right side of the viewport on wide screens
  const layout = () => {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rig.position.x = w > 1100 ? 1.05 : w > 900 ? 0.7 : 0;
    rig.position.y = w > 900 ? 0.42 : 0.1;
  };
  layout();
  addEventListener('resize', layout, { passive: true });

  /* ---------- mouse tilt ---------- */
  const target = new Vector2();
  const cur = new Vector2();
  addEventListener(
    'pointermove',
    (e) => {
      target.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    },
    { passive: true },
  );

  /* ---------- scroll: punch toward camera ---------- */
  const st = { p: 0 };
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
    onUpdate: (self) => (st.p = self.progress),
  });

  /* ---------- entrance ---------- */
  punch.scale.setScalar(0.6);
  punch.rotation.y = -1.2;
  gsap.to(punch.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: 'expo.out', delay: 0.15 });
  gsap.to(punch.rotation, { y: 0, duration: 1.8, ease: 'expo.out', delay: 0.15 });
  canvas.classList.add('is-ready');

  /* ---------- loop ---------- */
  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 }).observe(hero);

  const clock = { t: 0 };
  const loop = (time: number) => {
    if (!visible) return;
    clock.t = time / 1000;

    cur.lerp(target, 0.05);
    rig.rotation.y = cur.x * 0.35;
    rig.rotation.x = -cur.y * 0.25;

    // idle bob
    const bob = Math.sin(clock.t * 1.1) * 0.05;
    const p = st.p;

    // punch: right glove drives forward + rotates, left follows, both pass the camera at the end
    const ease = p * p * (3 - 2 * p);
    right.position.z = 0 + ease * 5.2;
    right.position.x = 0.42 - ease * 0.9;
    right.position.y = -0.02 + bob + ease * 0.25;
    right.rotation.x = 0.18 + ease * 0.9;
    right.rotation.y = -0.75 + ease * 0.6;

    left.position.z = -0.25 + ease * 3.6;
    left.position.x = -0.42 - ease * 0.4;
    left.position.y = -0.12 - bob * 0.6 + ease * 0.1;
    left.rotation.y = 0.75 - ease * 0.3;

    // subtle shared sway
    punch.rotation.z = Math.sin(clock.t * 0.7) * 0.03;

    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(loop);

  /* pause when tab hidden */
  document.addEventListener('visibilitychange', () => {
    renderer.setAnimationLoop(document.hidden ? null : loop);
  });
}
