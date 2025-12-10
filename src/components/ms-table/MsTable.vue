<template>
  <div class="ms-table-container flex-1 bg-white">
    <div class="ms-table-wrapper" ref="tableWrapper">
      <table class="ms-table">
        <thead class="ms-thead">
          <tr class="ms-tr header-row">
            <th class="ms-th th-first-cell fixed-left">
              <ms-checkbox
                class="min-w-10"
                v-model:checked="isAllSelected"
                style="border-right: 1px solid #d1d5db"
              />
            </th>

            <th
              v-for="(col, index) in columns"
              :key="col.field"
              class="ms-th"
              :class="{
                'fixed-left': col.fixed === 'left',
                'fixed-right': col.fixed === 'right',
                'has-filter': col.filterable,
                'has-sort': col.sortable,
              }"
              :style="getThStyle(col, index)"
              @click.stop="handleHeaderClick(col)"
            >
              <div
                class="flex-container"
                :class="col.align == 'right' ? 'justify-end' : 'justify-between'"
              >
                <span class="truncate">{{ col.title }}</span>

                <div
                  v-if="col.filterable"
                  class="filter-icon-container"
                  @click.stop="toggleFilterMenu(col)"
                >
                  <div class="icon_filter--default icon-16"></div>
                </div>
              </div>

              <div v-if="activeHeaderMenu === col.field" class="header-menu">
                <ul class="menu-list">
                  <li class="menu-item" @click.stop="handleSort(col, 'NONE')">
                    <div class="icon_empty icon-16"></div>
                    <span class="menu-text">Không sắp xếp</span>
                  </li>
                  <li class="menu-item" @click.stop="handleSort(col, 'ASC')">
                    <div class="icon_arrow-up icon-16"></div>
                    <span class="menu-text">Tăng dần</span>
                  </li>
                  <li class="menu-item" @click.stop="handleSort(col, 'DESC')">
                    <div class="icon_arrow-down icon-16"></div>
                    <span class="menu-text">Giảm dần</span>
                  </li>
                  <hr class="menu-divider" />
                  <li class="menu-item" @click.stop="handlePinning(col, 'left')">
                    <div class="icon_pin icon-16"></div>
                    <span class="menu-text">Ghim cột</span>
                  </li>
                  <li class="menu-item" @click.stop="handlePinning(col, null)">
                    <div class="icon_unpin icon-16"></div>
                    <span class="menu-text">Bỏ ghim cột</span>
                  </li>
                </ul>
              </div>

              <div v-if="activeFilterMenu === col.field" class="filter-popup" @click.stop>
                <div class="filter-content flex flex-col gap-4">
                  <div class="filter-title flex items-center justify-between">
                    <span>Lọc {{ col.title }}</span>
                    <div class="icon_close icon-16 icon-hover"></div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <ms-combobox v-model="operator" :options="textConditionOptions"></ms-combobox>
                    <ms-input placeholder="Nhập giá trị lọc"></ms-input>
                  </div>
                  <div class="filter-actions">
                    <ms-button type="filled-neutral">Bỏ lọc</ms-button>
                    <div class="flex gap-2">
                      <ms-button type="outlined">Hủy</ms-button>
                      <ms-button type="misa">Áp dụng</ms-button>
                    </div>
                  </div>
                </div>
              </div>
            </th>

            <th
              class="ms-th fixed-right action-col"
              :style="{ right: '0px', width: '80px', minWidth: '80px' }"
            ></th>
          </tr>
        </thead>

        <tbody class="ms-tbody">
          <!-- Khi loading -->
          <template v-if="props.loading">
            <tr v-for="i in 10" :key="'skeleton-' + i" class="ms-tr skeleton-row">
              <td
                class="ms-td fixed-left"
                :style="{ left: '0px', width: '30px', minWidth: '30px' }"
              ></td>

              <td
                v-for="(col, colIndex) in columns"
                :key="col.field"
                class="ms-td"
                :class="{
                  'fixed-left': col.fixed === 'left',
                  'fixed-right': col.fixed === 'right',
                }"
                :style="getTdStyle(col, colIndex)"
              >
                <div class="skeleton-line"></div>
              </td>

              <td
                class="ms-td fixed-right action-col"
                :style="{ right: '0px', width: '80px', minWidth: '80px' }"
              ></td>
            </tr>
          </template>
          <!-- Khi có data -->
          <template v-else-if="tableData.length > 0">
            <tr
              v-for="(row, rowIndex) in tableData"
              :key="rowIndex"
              class="ms-tr"
              :class="[{ 'row-selected': row.selected }, { 'row-clicked': activeRow === rowIndex }]"
              @click.stop="clickRow(rowIndex)"
              @dblclick="handleRowDoubleClick(row)"
            >
              <td
                class="ms-td fixed-left"
                :style="{ left: '0px', width: '30px', minWidth: '30px' }"
              >
                <ms-checkbox v-model:checked="row.selected"></ms-checkbox>
              </td>

              <td
                v-for="(col, colIndex) in columns"
                :key="col.field"
                class="ms-td"
                :class="{
                  'fixed-left': col.fixed === 'left',
                  'fixed-right': col.fixed === 'right',
                }"
                :style="getTdStyle(col, colIndex)"
              >
                <template v-if="$slots[col.field]">
                  <slot :name="col.field" :rowData="row"></slot>
                </template>
                <template v-else>
                  {{ row[col.field] || "-" }}
                </template>
              </td>

              <td
                class="ms-td fixed-right action-col"
                :style="{ right: '0px', width: '80px', minWidth: '80px' }"
              >
                <div class="action-icons-container">
                  <div class="action-icon-wrapper" @click="handleOpenEditPopup(row)">
                    <div class="icon_pencil icon-16 action-icon"></div>
                  </div>
                  <div class="action-icon-wrapper" @click.stop="toggleActionMenu(rowIndex)">
                    <div class="icon_feature-more icon-16 action-icon"></div>
                  </div>
                  <div v-if="activeRowActionMenu === rowIndex" class="action-menu" @click.stop>
                    <ul class="menu-list">
                      <li class="menu-item" @click.stop="handleAction('duplicate', row)">
                        <div class="icon_duplicate icon-16"></div>
                        <span class="menu-text">Nhân bản</span>
                      </li>
                      <li
                        v-if="row.workShiftStatus === STATUS.INACTIVE"
                        class="menu-item"
                        @click.stop="handleAction('updateStatus', row)"
                      >
                        <div class="icon_active icon-16"></div>
                        <span class="menu-text">Sử dụng</span>
                      </li>
                      <li v-else class="menu-item" @click.stop="handleAction('updateStatus', row)">
                        <div class="icon_empty icon-16"></div>
                        <span class="menu-text">Ngừng sử dụng</span>
                      </li>
                      <li class="menu-item" @click.stop="handleAction('delete', row)">
                        <div class="icon_trash icon-16"></div>
                        <span class="menu-text">Xóa</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <!-- Khi không có data -->
          <template v-else>
            <tr class="w-[150px] absolute table-no-data">
              Không có dữ liệu
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="props.loading" class="loading-overlay"></div>
  </div>
</template>

<script setup>
import MsCheckbox from "../ms-checkbox/MsCheckbox.vue";
import MsCombobox from "../ms-combobox/MsCombobox.vue";
import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";
import { ref, computed, onMounted, watch } from "vue";
import { STATUS } from "@/enums/Enum";

// props
const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});

// emit
const emit = defineEmits(["openEdit", "doubleClickRow", "action", "update:selectedRows", "sort"]);

// ref data
const tableData = ref([]);
const activeHeaderMenu = ref(null);
const activeFilterMenu = ref(null);
const activeRowActionMenu = ref(null);
const activeRow = ref(null);
const textConditionOptions = ref([
  { label: "(Trống)", value: "IS NULL" },
  { label: "(Không trống)", value: "IS NOT NULL" },
  { label: "Bằng", value: "=" },
  { label: "Khác", value: "!=" },
  { label: "Chứa", value: "contains", selected: true },
  { label: "Không chứa", value: "notcontains" },
  { label: "Bắt đầu với", value: "START WITH" },
  { label: "Kết thúc với", value: "END WITH" },
]);
/**
 * Emit danh sách các hàng đã chọn lên component cha
 * Created by: LQThinh (10/12/2025)
 */
const emitSelectedRows = () => {
  const selectedRows = tableData.value.filter((row) => row.selected);
  emit("update:selectedRows", selectedRows);
};
/**
 * Hàm cập nhật data cho table khi props data thay đổi
 * @returns {array} - danh sách bản ghi
 * Created by: LQThinh (06/12/2025)
 */
watch(
  () => props.data,
  (newVal) => {
    const newLocalData = newVal.map((item) => {
      const existingRow = tableData.value.find((r) => r.workShiftId === item.workShiftId);

      return {
        ...item,
        selected: existingRow ? existingRow.selected : false,
      };
    });
    tableData.value = newLocalData;
    emitSelectedRows();
  },
  { immediate: true, deep: true }
);
/**
 * Hàm selected tất cả
 * Created by: LQThinh (09/12/2025)
 */
const isAllSelected = computed({
  get() {
    if (tableData.value.length === 0) return false;

    return tableData.value.every((row) => row.selected);
  },
  set(newValue) {
    tableData.value.forEach((row) => {
      row.selected = newValue;
    });
    emitSelectedRows();
  },
});
/**
 * Theo dõi thay đổi trạng thái selected của từng row
 * Created by: LQThinh (10/12/2025)
 */
watch(
  () => tableData.value.map((row) => row.selected),
  () => {
    emitSelectedRows();
  },
  { deep: true }
);
/**
 * Hàm style cho header cell
 * @param col
 * @param index
 * Created by: LQThinh (09/12/2025)
 */
const getThStyle = (col, index) => {
  const style = {};
  if (col.width) style.width = col.width;
  if (col.minWidth) style.minWidth = col.minWidth;
  if (col.maxWidth) style.maxWidth = col.maxWidth;

  if (col.fixed === "left") {
    let leftOffset = 30;
    for (let i = 0; i < index; i++) {
      if (props.columns[i].fixed === "left") {
        leftOffset += parseInt(props.columns[i].width || props.columns[i].minWidth || "150px");
      }
    }
    style.left = `${leftOffset}px`;
  } else if (col.fixed === "right") {
    let rightOffset = 80;
    for (let i = props.columns.length - 1; i > index; i--) {
      if (props.columns[i].fixed === "right") {
        rightOffset += parseInt(props.columns[i].width || props.columns[i].minWidth || "150px");
      }
    }
    style.right = `${rightOffset}px`;
  }

  return style;
};

/**
 * Hàm style cho body cell
 * @param col
 * @param index
 * Created by: LQThinh (09/12/2025)
 */
const getTdStyle = (col, index) => {
  const style = {};
  if (col.width) style.width = col.width;
  if (col.minWidth) style.minWidth = col.minWidth;
  if (col.maxWidth) style.maxWidth = col.maxWidth;

  if (col.align) {
    style.textAlign = col.align;
  }
  return style;
};

/**
 * Toggle action menu
 * @param {number} index - Index của row
 * Created by: LQThinh (09/12/2025)
 */
const toggleActionMenu = (index) => {
  if (activeRowActionMenu.value === index) {
    activeRowActionMenu.value = null;
  } else {
    activeRowActionMenu.value = index;
    activeHeaderMenu.value = null;
    activeFilterMenu.value = null;
  }
};

/**
 * Click vào table header cell
 * @param col: table header cell
 * Created by: LQThinh (05/12/2025)
 */
const handleHeaderClick = (col, event) => {
  if (activeHeaderMenu.value === col.field) {
    activeHeaderMenu.value = null;
  } else {
    activeHeaderMenu.value = col.field;
    activeFilterMenu.value = null;
  }
};

const toggleFilterMenu = (col, event) => {
  if (!col.filterable) return;
  if (activeFilterMenu.value === col.field) {
    activeFilterMenu.value = null;
  } else {
    activeFilterMenu.value = col.field;
    activeHeaderMenu.value = null;
  }
};

const handleSort = (col, direction) => {
  emit("sort", col.field, direction);
  activeHeaderMenu.value = null;
};

const handlePinning = (col, fixedSide) => {
  console.log(`Pinning column ${col.field} to ${fixedSide}`);
  activeHeaderMenu.value = null;
};

const clickRow = (index) => {
  activeRow.value = index;
};

/**
 * Xử lý sự kiện mở popup sửa
 * @param row - dữ liệu row
 * Created by: LQThinh (09/12/2025)
 */
const handleOpenEditPopup = (row) => {
  emit("openEdit", row);
};

/**
 * Xử lý sự kiện Double-click vào row
 * @param {object} row - row đc click
 * Created by: LQThinh (09/12/2025)
 */
const handleRowDoubleClick = (row) => {
  emit("doubleClickRow", row);
};

/**
 * Xử lý các hành động (Nhân bản, Sử dụng, Xóa)
 * @param {string} action - Hành động được chọn
 * @param {object} row - Dữ liệu của row
 * Created by: LQThinh (10/12/2025)
 */
const handleAction = (action, row) => {
  emit("action", action, row);
  activeRowActionMenu.value = null;
};
/**
 * Bỏ chọn tất cả các hàng
 * Created by: LQThinh (10/12/2025)
 */
const unselectAll = () => {
  tableData.value.forEach((row) => {
    row.selected = false;
  });
  emitSelectedRows();
};

defineExpose({
  unselectAll,
});

onMounted(() => {
  /**
   * Gán sự kiện khi click ra ngoài
   * @param event
   * Created by: LQThinh (09/12/2025)
   */
  const handleClickOutside = (event) => {
    if (activeHeaderMenu.value || activeFilterMenu.value) {
      activeHeaderMenu.value = null;
      activeFilterMenu.value = null;
    }
    if (activeRowActionMenu.value !== null) {
      activeRowActionMenu.value = null;
    }
  };
  document.addEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* container */
.ms-table-container {
  height: 100%;
  border: none;
  font-size: 13px;
  overflow: auto;
}
.ms-table {
  table-layout: auto;
  width: 100%;
  border-collapse: collapse;
}
/* header */
.ms-thead {
  position: sticky;
  top: 0;
  z-index: 20;
}
.header-row {
  height: 30px;
  color: #1f2937;
}
.ms-th {
  text-align: left;

  font-size: 13px;
  font-weight: 600;
  background-color: #f3f4f6;
  border-bottom: 1px solid #d1d5db;
  cursor: pointer;
  height: 30px;
  color: #262626;
  position: sticky;
  top: 0;
  box-sizing: border-box;
}
.th-first-cell {
  left: 0px;
  width: 30px;
  height: 16px;
}
.flex-container {
  display: flex;
  align-items: center;
  height: 16px;
  border-right: 1px solid #d1d5db;
  padding-inline: 16px;
}

/* --- Fixed Columns --- */
.ms-th.fixed-left,
.ms-td.fixed-left {
  position: sticky;
  left: 0;
  z-index: 10;
  background-color: #f3f4f6;
}

.ms-td.fixed-left {
  background-color: white;
}
.ms-tr.row-selected .ms-td.fixed-left {
  background-color: #a4f6d3;
}

.ms-th.fixed-right,
.ms-td.fixed-right {
  position: sticky;
  right: 0;
  z-index: 10;
  background-color: #f3f4f6;
}
.ms-td.fixed-right {
  background-color: white;
}
.ms-tr.row-selected .ms-td.fixed-right {
  background-color: #a4f6d3;
}

/* --- Filter Icon --- */
.filter-icon-container {
  opacity: 0;
  transition: opacity 150ms ease-in-out;
}
.ms-th.has-filter:hover .filter-icon-container {
  opacity: 1;
}
.filter-icon {
  height: 1rem;
  width: 1rem;
  color: #6b7280;
  transition: color 150ms ease-in-out;
}
.filter-icon:hover {
  color: #4b5563;
}

/* --- Header Menu (Sắp xếp, Ghim) --- */
.header-menu {
  position: absolute;
  z-index: 999;
  top: 30px;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  width: 10rem;
  font-size: 13px;
  animation: slide-down 0.2s ease;
}
.menu-list {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.menu-item {
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  cursor: pointer;
}
.menu-item:hover {
  background-color: #f3f4f6;
}
.menu-text {
  margin-left: 0.5rem;
  color: #111827;
  font-weight: 400;
}
.menu-divider {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  border-color: #e5e7eb;
}

/* --- Filter Popup (Lọc) --- */
.filter-popup {
  width: 350px;
  position: absolute;
  z-index: 40;
  top: 32px;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0 0 8px #0000001a, 0 8px 16px #0000001a;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
}
.filter-content {
  padding: 16px;
}
.filter-title {
  font-size: 16px;
  font-weight: 600;
}
.filter-input {
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
.filter-actions {
  display: flex;
  justify-content: space-between;
}
/* ---------------------------------------------------- */
/* 3. BODY STYLES (ms-tbody, ms-tr, ms-td)              */
/* ---------------------------------------------------- */

.ms-tr {
  position: relative;
  height: 32px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
  color: #111827;
}
.ms-td {
  padding-left: 16px;
  padding-right: 16px;
  white-space: nowrap;
  background-color: #fff;
}

/* Hover State */
.ms-tr:hover .ms-td {
  background-color: #e5e7eb;
}
.ms-tr.row-clicked .ms-td {
  background-color: #a4f6d3;
}
/* Selected Row State */
.ms-tr.row-selected .ms-td {
  background-color: #a4f6d3;
}
.ms-tr.row-clicked .ms-td {
  background-color: #a4f6d3;
}
.action-icons-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.action-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: color 150ms ease-in-out;
}
.action-icon-wrapper .action-icon:hover {
  background-color: #009b71;
}
.table-no-data {
  text-align: center;
  font-style: normal;
  color: #111827;
  top: 30%;
  left: 50%;
  transform: translate(-50%, 100%);
}
/* --- Loading Overlay --- */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 50;
  pointer-events: none;
}
@keyframes loading-pulse {
  0% {
    background-color: #f3f4f6; /* light gray */
  }
  50% {
    background-color: #e5e7eb; /* slightly darker gray */
  }
  100% {
    background-color: #f3f4f6;
  }
}

.skeleton-row .ms-td {
  background-color: #fff !important;
}

.skeleton-line {
  height: 12px;
  width: 80%;
  border-radius: 4px;
  animation: loading-pulse 1.5s infinite ease-in-out;
}

/* --- Action Menu (Menu cho từng hàng) --- */
.action-menu {
  position: absolute;
  z-index: 999;
  top: 0;
  right: 88px;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 13px;
  animation: slide-down 0.2s ease;
  margin-top: 4px;
}

.action-menu .menu-list {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.action-menu .menu-item {
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
}
.action-menu .menu-item:hover {
  background-color: #f3f4f6;
}
.action-menu .menu-text {
  margin-left: 0.5rem;
  color: #111827;
  font-weight: 400;
}
.action-col .relative {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
