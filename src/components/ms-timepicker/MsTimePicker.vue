<template>
  <div
    class="ms-timepicker-wrapper flex items-center w-full justify-between"
    :class="{ 'justify-end': isAlignEnd }"
  >
    <label v-if="label" class="ms-input-label flex-shrink-0">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div
      class="ms-timepicker-container relative"
      :class="props.width"
      v-click-outside="closeDropdown"
    >
      <div
        class="ms-input-box ms-input-container flex items-center rounded-sm bg-white overflow-hidden"
        :class="[
          containerHeight,
          { 'is-focus': isDropdownOpen },
          { 'border-error': shouldShowErrorBorder },
        ]"
      >
        <input
          type="text"
          :placeholder="placeholder"
          :value="modelValue"
          @input="handleInput"
          @blur="handleBlur"
          class="ms-input-field w-full h-full text-sm bg-transparent border-none outline-none"
          :style="placeholderStyle"
          maxlength="5"
          :tabindex="tabIndex"
        />

        <div
          class="ms-input-icon icon_time icon-16 right-3 ml-1 cursor-pointer"
          @mousedown.prevent="toggleDropdown"
        ></div>
      </div>

      <div
        v-if="isDropdownOpen"
        class="ms-timepicker-dropdown absolute z-10 w-full rounded-sm shadow-md mt-1 bg-white max-h-[200px] overflow-y-auto"
      >
        <div
          v-for="time in timeOptions"
          :key="time"
          class="time-option text-sm px-3 py-1.5 cursor-pointer"
          :class="{ 'is-selected': time === modelValue }"
          @click="selectTime(time)"
        >
          {{ time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

// props
const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "HH:MM" },
  required: { type: Boolean, default: false },
  maxHeight: { type: String, default: "max-h-[28px]" },
  placeholderAlign: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
  width: {
    type: String,
    default: "flex-1",
  },
  isAlignEnd: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  tabIndex: {
    type: [String, Number],
    default: null,
  },
});

// emits
const emit = defineEmits(["update:modelValue"]);

// state
const isTouched = ref(false);
const isDropdownOpen = ref(false);
const timeOptions = ref([]);

/**
 * Tính toán style chiều cao, vị trí
 * Created by: LQThinh (08/12/2025)
 */
const containerHeight = computed(() => props.maxHeight);
const placeholderStyle = computed(() => ({
  "--placeholder-align": props.placeholderAlign,
}));

/**
 * Tính toán xem có nên hiển thị border lỗi hay không
 * Created by: LQThinh (08/12/2025)
 */
const shouldShowErrorBorder = computed(() => {
  return props.isError && isTouched.value;
});

/**
 * Directive tùy chỉnh để đóng dropdown khi click ra ngoài
 * Created by: LQThinh (08/12/2025)
 */
const vClickOutside = {
  mounted: (el, binding) => {
    el.__ClickOutsideHandler__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.__ClickOutsideHandler__, true);
  },
  unmounted: (el) => {
    document.body.removeEventListener("click", el.__ClickOutsideHandler__, true);
  },
};

/**
 * Hàm tạo danh sách thời gian (step 30 phút)
 * Created by: LQThinh (08/12/2025)
 */
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      options.push(`${hour}:${minute}`);
    }
  }
  timeOptions.value = options;
};

/**
 * Xử lý sự kiện nhập liệu từ input với logic tự động định dạng HH:MM
 */
const handleInput = (event) => {
  let rawValue = event.target.value;

  // 1. Lọc chỉ giữ lại số
  let numbers = rawValue.replace(/[^0-9]/g, "");

  let formattedValue = "";

  if (numbers.length >= 1) {
    // Lấy 2 ký tự đầu cho Giờ (HH)
    let hour = numbers.slice(0, 2);
    if (hour.length === 2 && parseInt(hour, 10) > 23) {
      hour = "23"; // Giới hạn Giờ
    }
    formattedValue += hour;
  }

  if (numbers.length >= 3) {
    formattedValue += ":";
    // Lấy 2 ký tự tiếp theo cho Phút (MM)
    let minute = numbers.slice(2, 4);
    if (minute.length === 2 && parseInt(minute, 10) > 59) {
      minute = "59"; // Giới hạn Phút
    }
    formattedValue += minute;
  }

  if (formattedValue.length > 5) {
    formattedValue = formattedValue.slice(0, 5);
  }

  emit("update:modelValue", formattedValue);
};

/**
 * Xử lý khi blur khỏi input: kiểm tra và hoàn thiện format cuối cùng
 */
const handleBlur = (event) => {
  isTouched.value = true;
  let currentValue = event.target.value;

  // 1. Lọc chỉ lấy số
  const cleanValue = currentValue.replace(/[^0-9]/g, "");

  // 2. Chỉ xử lý khi có đủ 4 chữ số
  if (cleanValue.length === 4) {
    const hour = parseInt(cleanValue.substring(0, 2), 10);
    const minute = parseInt(cleanValue.substring(2, 4), 10);

    // 3. Kiểm tra tính hợp lệ của giờ (0-23) và phút (0-59)
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      // Định dạng lại HH:MM hoàn chỉnh (ví dụ: 705 -> 07:05)
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");

      const finalValue = `${formattedHour}:${formattedMinute}`;

      if (props.modelValue !== finalValue) {
        emit("update:modelValue", finalValue);
      }
      return;
    }
  }

  // 4. Nếu không hợp lệ hoặc chưa đủ 4 số, reset về rỗng
  if (currentValue !== "") {
    emit("update:modelValue", "");
  }
};

/**
 * Mở dropdown (khi focus)
 */
const openDropdown = () => {
  isDropdownOpen.value = true;
};

/**
 * Đóng dropdown (dùng bởi v-click-outside)
 */
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

/**
 * Bật/Tắt dropdown (khi click icon)
 */
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

/**
 * Xử lý sự kiện khi click chọn giờ từ dropdown
 */
const selectTime = (time) => {
  emit("update:modelValue", time);
  closeDropdown();
};

onMounted(() => {
  generateTimeOptions();
});
</script>

<style scoped>
.ms-input-label {
  width: 150px;
  color: #262626;
  font-weight: 500;
  font-size: 13px;
}
.ms-input-container {
  border: 1px solid #d1d5db;
  font-size: 13px;
  transition: border-color 0.2s ease;
}
.ms-input-container.border-error {
  border-color: #ff0000;
}
.ms-input-container:hover {
  border-color: #9ca3af;
}
.ms-input-container:focus-within,
.ms-input-container.is-focus {
  border-color: #009b71;
}
.ms-input-field {
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 400;
  padding-right: 32px; /* Để nhường chỗ cho icon */
}
.ms-input-field::placeholder {
  font-size: 13px;
  font-weight: 400;
  color: #9ca3af;
  text-align: var(--placeholder-align, left);
}
.ms-input-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
}
.ms-input-icon.cursor-pointer {
  pointer-events: all;
}
.ms-timepicker-dropdown {
  border: 1px solid #d1d5db;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  z-index: 10;
}
.time-option {
  font-size: 13px;
  color: #374151;
}
.time-option:hover {
  background-color: #f3f4f6;
  color: #009b71;
}
.time-option.is-selected {
  background-color: #e0f2f1;
  color: #009b71;
  font-weight: 600;
}
</style>
