<template>
  <canvas ref="canvas" class="size-full" />
</template>

<script setup lang="ts">
import * as THREE from "three";
const canvas = ref<HTMLCanvasElement | null>(null);

const props = defineProps<{
  texture: string;
}>();

onMounted(() => {
  const canvasElement = canvas.value;
  if (!canvasElement) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    40,
    canvasElement.clientWidth / canvasElement.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(props.texture, (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshLambertMaterial({
      map: texture,
    });

    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    camera.position.z = 3;

    const light = new THREE.DirectionalLight(0xffffff, 2.8);
    light.position.set(2, 4, 3).normalize();
    scene.add(light);

    const animate = () => {
      sphere.rotation.y += 0.0045;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  });

  window.addEventListener("resize", () => {
    camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
  });
});
</script>
