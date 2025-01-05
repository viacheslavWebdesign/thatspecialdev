<script setup lang="ts">
import { Vector2 } from "three";

const blobRef = ref(null);

const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: new Vector2(0.5, 1.5) },
  uFrequency: { value: new Vector2(20, 5) },
};

const fragmentShader = `
precision mediump float;
varying vec2 vUv;

void main() {
    float darkRedFactor = 0.9 - vUv.x; 
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * darkRedFactor;
}
`;

const vertexShader = `
uniform vec2 uAmplitude;
uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * uFrequency.x - uTime) * uAmplitude.x;
    modelPosition.x += cos(modelPosition.y * uFrequency.y - uTime) * uAmplitude.y;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
}
`;

const { onLoop } = useRenderLoop();

onLoop(({ elapsed }) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value = elapsed;
  }
});
</script>

<template>
  <TresCanvas alpha>
    <TresPerspectiveCamera :position="[0, 0, 4]" />
    <TresGroup>
      <TresMesh :position="[0.5, 0, 0]" ref="blobRef">
        <TresCircleGeometry :args="[1, 64]" />
        <TresShaderMaterial
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :uniforms="uniforms"
        />
      </TresMesh>
    </TresGroup>
  </TresCanvas>
</template>
