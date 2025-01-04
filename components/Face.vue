<script setup lang="ts">
import { gsap } from "gsap";
const faceRef = shallowRef<THREE.Group | null>(null);
const mouseX = ref<number>(0);
const mouseY = ref<number>(0);
const targetRotationX = ref<number>(0);
const targetRotationY = ref<number>(0);
const modelRotationX = ref<number>(0);
const modelRotationY = ref<number>(0);

const isRotationEnabled = ref<boolean>(false);

const handleMouseMove = (event: MouseEvent): void => {
  if (!isRotationEnabled.value) return;
  mouseX.value = Math.min(
    Math.max((event.clientX / window.innerWidth) * 2 - 1, -1),
    1
  );
  mouseY.value = Math.min(
    Math.max(-(event.clientY / window.innerHeight) * 2 + 1, -1),
    1
  );

  targetRotationY.value = mouseX.value * Math.PI * 0.2;
  targetRotationX.value = -mouseY.value * Math.PI * 0.15;
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);

  watchEffect(() => {
    if (faceRef.value) {
      gsap.fromTo(
        faceRef.value.rotation,
        { y: 10 },
        {
          y: 0,
          duration: 2,
          ease: "power4.Out",
          delay: 4,
          onStart: () => {
            isRotationEnabled.value = false;
          },
          onComplete: () => {
            isRotationEnabled.value = true;
            gsap.to(faceRef.value.position, {
              y: 0.015,
              yoyo: true,
              duration: 1.5,
              ease: "power1.inOut",
              repeat: -1,
            });
            gsap.ticker.add(updateRotation);
          },
        }
      );
    }
  });
});

const updateRotation = (): void => {
  if (faceRef.value) {
    gsap.to(faceRef.value.rotation, {
      x: targetRotationX.value,
      y: targetRotationY.value,
      duration: 0.1,
      ease: "power1.inOut",
    });
  }
};

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  gsap.ticker.remove(updateRotation);
});
</script>

<template>
  <TresCanvas shadows alpha>
    <TresPerspectiveCamera :position="[0, 0, 0.4]" />
    <TresGroup
      ref="faceRef"
      :position="[0, 0, 0]"
      :scale="[1, 1, 1]"
      :rotation="[modelRotationX, modelRotationY, 0]"
    >
      <Suspense>
        <GLTFModel
          path="/models/face.glb"
          :position="[0, -1.72, 0]"
          :rotation="[0, -0.1, 0]"
        />
      </Suspense>
    </TresGroup>
    <TresDirectionalLight :position="[0, 0, 10]" :intensity="2.5" />
  </TresCanvas>
</template>
