<template>
  <div class="ms-pagination flex justify-between items-center px-4">
    <div class="flex items-center">
      <span class="mr-1">Tổng số:</span>
      <strong class="font-bold">{{ totalRecords }}</strong>
    </div>

    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-4">
        <span>Số dòng/trang</span>
        <select
          v-model="internalPageSize"
          @change="$emit('update:pageSize', internalPageSize)"
          class="form-select custom-select rounded-sm py-1 px-2 pr-8 text-sm cursor-pointer focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          style="width: 80px"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>

      <span class="mr-4 font-bold">{{ recordRangeText }}</span>

      <div class="flex items-center">
        <ms-button
          type="text"
          icon="icon_step-backward"
          @click="goToPage(1)"
          :disabled="isFirstPage"
          :class="[
            'transition duration-150',
            isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200',
          ]"
        >
        </ms-button>

        <ms-button
          type="text"
          icon="icon_angle-left"
          @click="goToPage(currentPage - 1)"
          :disabled="isFirstPage"
          :class="[
            'transition duration-150',
            isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200',
          ]"
        >
        </ms-button>

        <ms-button
          type="text"
          icon="icon_angle-right"
          @click="goToPage(currentPage + 1)"
          :disabled="isLastPage"
          :class="[
            'transition duration-150',
            isLastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200',
          ]"
        >
        </ms-button>

        <ms-button
          type="text"
          icon="icon_step-forward"
          @click="goToPage(totalPages)"
          :disabled="isLastPage"
          :class="[
            'transition duration-150',
            isLastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200',
          ]"
        >
        </ms-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";
import MsButton from "../ms-button/MsButton.vue";

// props
const props = defineProps({
  totalRecords: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSize: {
    type: Number,
    required: true,
    default: 20,
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50, 100],
  },
});

// emits
const emit = defineEmits(["update:currentPage", "update:pageSize"]);

// state
const internalPageSize = ref(props.pageSize);

/**
 * Tính tổng số trang
 * Created by: LQThinh (06/12/2025)
 */
const totalPages = computed(() => {
  return Math.ceil(props.totalRecords / props.pageSize);
});

/**
 * Tính trạng thái các nút
 * Created by: LQThinh (06/12/2025)
 */
const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage >= totalPages.value);

/**
 * Tính range bản ghi hiện tại (1-20)
 * Created by: LQThinh (06/12/2025)
 */
const recordRangeText = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize + 1;
  let end = props.currentPage * props.pageSize;

  if (end > props.totalRecords) {
    end = props.totalRecords;
  }

  if (props.totalRecords === 0) {
    return "0-0";
  }

  return `${start}-${end}`;
});

/**
 * Hàm chuyển đến một trang cụ thể
 * @param {number} page - Số trang muốn đến
 */
const goToPage = (page) => {
  // Đảm bảo trang nằm trong phạm vi hợp lệ
  const newPage = Math.max(1, Math.min(page, totalPages.value));

  if (newPage !== props.currentPage) {
    emit("update:currentPage", newPage);
  }
};
</script>

<style scoped>
.ms-pagination {
  height: 44px;
  min-height: 44px;
  align-items: center;
  background-color: #f3f4f6;
  font-size: 13px;
  padding: 8px 16px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.custom-select {
  border: 1px solid #d1d5db;
}
.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("@/assets/icons/angle-down.svg");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}

button:disabled {
  opacity: 1;
}
</style>
