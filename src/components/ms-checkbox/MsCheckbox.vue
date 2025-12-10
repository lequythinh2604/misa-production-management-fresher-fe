<template>
  <div
    class="flex justify-center items-center"
    :class="['ms-checkbox', { 'ms-checkbox--checked': modelValue }]"
    :tabindex="0"
    role="checkbox"
    :aria-checked="modelValue"
    @click="toggleCheck"
  >
    <div
      class="ms-checkbox-box relative block w-4 h-4 flex items-center justify-center box-border cursor-pointer bg-white"
    >
      <svg
        v-if="modelValue"
        class="w-3 h-3 text-white transition-opacity duration-200"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 13L9 17L19 7"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const modelValue = defineModel("checked", { default: false });
const props = defineProps({});

/**
 * Hàm chuyển đổi trạng thái checked
 * Created By THINHLQ - 6/12/2025
 */
const toggleCheck = () => {
  modelValue.value = !modelValue.value;
};
</script>

<style scoped>
.ms-checkbox-box {
  transition: all 0.2s ease;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #d1d5db;
  border-radius: 2px;
}
.ms-checkbox-box:hover {
  border-color: #009b71;
}
.ms-checkbox--checked .ms-checkbox-box {
  background-color: #009b71;
  border-color: #009b71;
}
</style>
