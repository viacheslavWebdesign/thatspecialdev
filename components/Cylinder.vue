<template>
  <div ref="canvasContainerRef">
    <canvas ref="canvas" class="sticky" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  textures: {
    type: Array,
  },
});

const canvasContainerRef = ref<HTMLCanvasElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  nextTick(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const canvasElement = canvas.value;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
    if (window.innerWidth > 576) {
      camera.position.set(0, -0.2, 6);
    } else {
      camera.position.set(0, -1.2, 8);
    }
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const textureLoader = new THREE.TextureLoader();

    const textures = props.textures.map((path) => textureLoader.load(path));

    const createCylindricalPlanes = (
      textures: THREE.Texture[],
      rows: number,
      columns: number,
      radius: number,
      height: number,
      camera: THREE.Camera
    ) => {
      const group = new THREE.Group();
      const angleStep = (2 * Math.PI) / columns;
      const heightStep = height / rows;

      textures.forEach((texture, index) => {
        texture.encoding = THREE.sRGBEncoding;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        const row = Math.floor(index / columns);
        const col = index % columns;

        const angle = col * angleStep;
        const y = height / 2 - row * heightStep;

        const geometry = new THREE.PlaneGeometry(1.416, 0.8);
        const material = new THREE.MeshLambertMaterial({
          map: texture,
        });
        const plane = new THREE.Mesh(geometry, material);

        plane.position.set(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        );
        plane.lookAt(camera.position);

        group.add(plane);
      });

      return group;
    };

    const cylinderRadius = window.innerWidth > 576 ? 3 : 2;

    const cylindricalPlanes = createCylindricalPlanes(
      textures,
      1,
      6,
      cylinderRadius,
      1.3,
      camera
    );

    scene.add(cylindricalPlanes);

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(0, 0, 10).normalize();
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);

      cylindricalPlanes.children.forEach((plane) => {
        plane.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.render(scene, camera);
    });

    const canvasContainer = canvasContainerRef.value;

    const cameraEndPos: string = window.innerWidth > 576 ? "-2.4" : "-1.8";

    const tween = gsap.timeline();
    tween
      .to(camera.position, {
        y: cameraEndPos,
        ease: "none",
      })
      .to(
        cylindricalPlanes.rotation,
        {
          y: "+=" + Math.PI * -1.25,
          ease: "none",
        },
        0
      );

    ScrollTrigger.create({
      trigger: canvasContainer,
      start: "top top",
      end: "bottom+=500vh",
      pin: true,
      animation: tween,
      invalidateOnRefresh: true,
      scrub: 1,
    });
  });
});
</script>
