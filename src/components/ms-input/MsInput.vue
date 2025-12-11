<template>
  <div class="ms-input-wrapper flex items-center" :class="getJustifyClass">
    <label v-if="label" class="ms-input-label flex-shrink-0">
      {{ label }}
      <span v-if="required" class="text-required">&nbsp;*</span>
    </label>
    <div
      class="ms-input-container relative flex items-center rounded-sm bg-white overflow-hidden"
      :class="[containerHeight, containerWidth, { 'border-error': shouldShowErrorBorder }]"
    >
      <div v-if="$slots['icon-left']" class="ms-input-icon left-3 mr-1">
        <slot name="icon-left"></slot>
      </div>

      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="handleBlur"
        class="ms-input-field w-full h-full text-sm bg-transparent border-none outline-none"
        :class="{
          'has-icon-left': $slots['icon-left'],
          'has-icon-right': $slots['icon-right'],
          'ms-disabled': isDisabled,
          'text-red': isWarning,
        }"
        :tabindex="tabIndex"
        :readonly="readOnly"
        :disabled="isDisabled"
        :style="[placeholderStyle]"
        :maxlength="maxLength"
      />

      <div v-if="$slots['icon-right']" class="ms-input-icon right-3 ml-1">
        <slot name="icon-right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "flex-1",
  },
  maxHeight: {
    type: String,
    default: "max-h-[28px]",
  },
  placeholderAlign: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String,
    default: "start",
    validator: (value) => ["start", "between", "end"].includes(value),
  },
  tabIndex: {
    type: [String, Number],
    default: null,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  isWarning: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: [String, Number],
    default: null,
  },
});

// emits
const emit = defineEmits(["update:modelValue"]);

// state
const isTouched = ref(false);

/**
 * Tính toán class tailwind cho width và height
 * Created by: LQThinh (06/12/2025)
 */
const containerWidth = computed(() => props.width);
const containerHeight = computed(() => props.maxHeight);

/**
 * Tính toán style cho CSS Variable để truyền giá trị căn lề
 * Created by: LQThinh (06/12/2025)
 */
const placeholderStyle = computed(() => ({
  "--placeholder-align": props.placeholderAlign,
}));

/**
 * Tính toán class cho ms-input-wrapper
 * @param {string} justify
 * Created by: LQThinh (06/12/2025)
 */
const getJustifyClass = computed(() => {
  return "justify-" + props.justify;
});

/**
 * Xử lý sự kiện blur
 * Created by: LQThinh (08/12/2025)
 */
const handleBlur = () => {
  isTouched.value = true;
};

/**
 * Tính toán xem có nên hiển thị border lỗi hay không
 * Created by: LQThinh (08/12/2025)
 */
const shouldShowErrorBorder = computed(() => {
  return props.isError && isTouched.value;
});
</script>

<style scoped>
.ms-input-label {
  width: 180px;
  color: #262626;
  font-weight: 500;
  font-size: 13px;
}
.text-required {
  color: #e54848;
}
.text-red {
  color: #ff0000 !important;
}
.ms-input-container {
  border: 1px solid #d1d5db;
  font-size: 13px;
  min-width: 0;
}
.ms-input-container:focus-within {
  border-color: #009b71;
}
.ms-input-container.border-error {
  border-color: #ff0000;
}
.ms-input-field {
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 400;
  text-align: var(--placeholder-align, left);
}
.ms-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.ms-input-field.has-icon-left {
  padding-left: 32px;
}
.ms-input-field.has-icon-right {
  padding-right: 32px;
}
.ms-input-field::placeholder {
  font-size: 13px;
  font-weight: 400;
  color: #9ca3af;
  text-align: var(--placeholder-align, left);
}
.ms-disabled {
  background-color: #f3f4f6;
  color: #4b5563;
}
</style>
