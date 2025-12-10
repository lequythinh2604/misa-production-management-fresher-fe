<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div class="flex flex-col justify-center items-center gap-2">
      <img class="w-[310px]" :src="tempImg" alt="misa-avatar" loading="lazy" />
      <div class="text-center text-lg">Tính năng đang được phát triển. Hãy quay lại sau !</div>
    </div>
  </div>
</template>
<script setup>
import tempImg from "@/assets/images/temp.png";
</script>
<style scoped></style>
