<template>
  <div class="w-full" ref="container">
    <canvas ref="canvas" class="size-full" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
const container = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const props = defineProps<{
  texture: string;
}>();

const cursor = {
  x: 0,
  y: 0,
};

const vertexShader = `
  precision mediump float;

  uniform vec2 uFrequency;
  uniform float uTime;
  uniform float uAmplitude;

  attribute float aRandom;

  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * uAmplitude;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * uAmplitude;

    modelPosition.z += elevation;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vUv = uv;
    vElevation = elevation;
  }
`;

const fragmentShader = `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec3 uColor;
  uniform float uTime;

  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
`;

onMounted(() => {
  const canvasElement = canvas.value;
  const containerElement = container.value;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(window.devicePixelRatio);

  const resize = () => {
    const width = containerElement.clientWidth;
    const height = (width * 9) / 16;
    canvasElement.width = width;
    canvasElement.height = height;
    renderer.setSize(width, height);
    camera.aspect = 16 / 9;
    camera.updateProjectionMatrix();
  };

  window.addEventListener("resize", resize);
  resize();

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(props.texture, (texture) => {
    // texture.encoding = THREE.sRGBEncoding;
    texture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.BufferGeometry();
    const width = 16;
    const height = 9;
    const segments = 30;

    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (j / segments) * width - width / 2;
        const y = (i / segments) * height - height / 2;
        vertices.push(x, y, 0);
        uvs.push(j / segments, i / segments);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = i * (segments + 1) + j + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = (i + 1) * (segments + 1) + j + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    const randoms = new Float32Array(vertices.length / 3);
    for (let i = 0; i < randoms.length; i++) {
      randoms[i] = Math.random();
    }
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    geometry.setIndex(indices);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0.0, 0.0, 0.0) },
        uTexture: { value: texture },
        uFrequency: { value: new THREE.Vector2(2.0, 2.0) },
        uAmplitude: { value: 0.2 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 6.8;

    const smoothFactor = 0.05;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 6.8;

    const smoothCameraPosition = () => {
      camera.position.x += (targetX - camera.position.x) * smoothFactor;
      camera.position.y += (targetY - camera.position.y) * smoothFactor;
      camera.position.z += (targetZ - camera.position.z) * smoothFactor;
    };

    canvasElement.addEventListener("mousemove", (event) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const targetXCoord = x / canvasElement.width - 0.5;
      const targetYCoord = -(y / canvasElement.height - 0.5);

      cursor.x += (targetXCoord - cursor.x) * smoothFactor;
      cursor.y += (targetYCoord - cursor.y) * smoothFactor;

      targetX = cursor.x * 4;
      targetY = cursor.y * 4;
      targetZ = 8;
    });

    canvasElement.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      targetZ = 6.8;
    });

    const animate = () => {
      smoothCameraPosition();
      material.uniforms.uTime.value += 0.02;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });
});
</script>
