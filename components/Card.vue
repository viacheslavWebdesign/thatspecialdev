<script setup lang="ts">
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const containerRef = ref<HTMLCanvasElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const groupRef = ref<THREE.Group | null>(null);

const props = defineProps<{
  texture: string;
}>();

const emit = defineEmits<{
  (event: "groupRotation", rotation: THREE.Euler): void;
}>();

onMounted(() => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  let groupElement = groupRef.value;

  if (!canvas || !container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4.8;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  const updateCanvasSize = () => {
    const width = container.clientWidth;
    const height = width;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  };

  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);

  const group = new THREE.Group();
  groupElement = group;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  const createRoundedRectShape = (width, height, radius) => {
    const shape = new THREE.Shape();
    shape.moveTo(radius, 0);
    shape.lineTo(width - radius, 0);
    shape.quadraticCurveTo(width, 0, width, radius);
    shape.lineTo(width, height - radius);
    shape.quadraticCurveTo(width, height, width - radius, height);
    shape.lineTo(radius, height);
    shape.quadraticCurveTo(0, height, 0, height - radius);
    shape.lineTo(0, radius);
    shape.quadraticCurveTo(0, 0, radius, 0);
    return shape;
  };

  const frontGeometry = new THREE.ExtrudeGeometry(
    createRoundedRectShape(5.25, 3, 0.2),
    { depth: 0.1, bevelEnabled: false }
  );
  frontGeometry.center();

  const backGeometry = new THREE.ExtrudeGeometry(
    createRoundedRectShape(5.25, 3, 0.2),
    { depth: 0.05, bevelEnabled: false }
  );
  backGeometry.center();

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(props.texture);
  texture.minFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  texture.repeat.set(0.195, 0.335);

  const frontMaterials = [
    new THREE.MeshLambertMaterial({
      map: texture,
      side: THREE.FrontSide,
    }),
    new THREE.MeshLambertMaterial({
      color: 0x252525,
      side: THREE.DoubleSide,
    }),
  ];

  const backMaterials = new THREE.MeshLambertMaterial({
    color: 0x252525,
    side: THREE.DoubleSide,
  });

  const frontMesh = new THREE.Mesh(frontGeometry, frontMaterials);
  frontMesh.position.z = 0.025;
  groupElement.add(frontMesh);

  const backMesh = new THREE.Mesh(backGeometry, backMaterials);
  backMesh.position.z = -0.025;
  groupElement.add(backMesh);

  scene.add(groupElement);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  scene.add(light);

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    light.position.copy(camera.position).normalize();
    renderer.render(scene, camera);
  };

  animate();

  gsap.to(groupElement.position, {
    y: 0.35,
    yoyo: true,
    duration: 1.25,
    ease: "power1.inOut",
    repeat: -1,
  });

  emit("groupRotation", groupElement.rotation);
});
</script>

<template>
  <div ref="containerRef" class="w-full max-w-[800px] mx-auto">
    <canvas ref="canvasRef" class="w-full"></canvas>
  </div>
</template>
