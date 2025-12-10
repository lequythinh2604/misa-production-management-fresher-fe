<template>
  <div class="ms-textarea-wrapper flex items-start" :class="[containerWidth]">
    <label v-if="label" class="ms-input-label flex-shrink-0 pt-[5px]">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div
      class="ms-textarea-container relative flex items-center rounded-sm bg-white overflow-hidden flex-1"
    >
      <textarea
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :rows="rows"
        :readonly="readonly"
        class="ms-textarea-field w-full h-full text-sm bg-transparent border-none outline-none resize-none"
        :style="placeholderStyle"
        :tabindex="tabIndex"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "w-full",
  },
  rows: {
    type: [String, Number],
    default: 3,
  },
  placeholderAlign: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
  tabIndex: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

/**
 * Tính toán class tailwind cho width
 * Created by: LQThinh (06/12/2025)
 */
const containerWidth = computed(() => props.width);

/**
 * Tính toán style cho CSS Variable để truyền giá trị căn lề placeholder
 * Created by: LQThinh (06/12/2025)
 */
const placeholderStyle = computed(() => ({
  "--placeholder-align": props.placeholderAlign,
}));
</script>

<style scoped>
.ms-textarea-wrapper {
  min-height: 40px;
}
.ms-input-label {
  width: 180px;
  color: #262626;
  font-weight: 500;
  font-size: 13px;
}

/* Container */
.ms-textarea-container {
  border: 1px solid #d1d5db;
  font-size: 13px;
  min-width: 0;
  padding: 0;
}
.ms-textarea-container:focus-within {
  border-color: #009b71;
}

/* Textarea Field */
.ms-textarea-field {
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
}
.ms-textarea-field::placeholder {
  font-size: 13px;
  font-weight: 400;
  color: #9ca3af;
  text-align: var(--placeholder-align, left);
}
</style>
