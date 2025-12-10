<template>
  <div class="flex flex-col h-full w-full">
    <!-- Title box -->
    <div class="title-box flex justify-between items-center mb-4">
      <div class="font-bold text-2xl">Ca làm việc</div>
      <div class="main-button">
        <ms-button icon="icon_add-white" @click="handleOpenAddPopup">Thêm</ms-button>
      </div>
    </div>
    <!-- Body layout -->
    <div class="body-layout flex-1 min-h-0 flex flex-col">
      <!-- Tool box -->
      <div class="tool-box flex justify-between">
        <div class="flex gap-2">
          <ms-input v-model="keyword" placeholder="Tìm kiếm" width="w-[200px]">
            <template #icon-left>
              <div class="icon_search icon-16"></div>
            </template>
          </ms-input>
          <!-- đã chọn, bỏ chọn, xóa,... -->
          <div v-if="isAnySelected" class="flex justify-between items-center gap-2">
            <div class="min-w-[60px]">
              Đã chọn <span class="font-bold">{{ selectedCount }}</span>
            </div>
            <ms-button type="text" @click="handleUnselectAll">Bỏ chọn</ms-button>
            <ms-button
              v-if="canActivate"
              type="outline-success"
              icon="icon_active--green"
              @click="handleUpdateStatusBatch(selectedWorkShifts, true)"
            >
              Sử dụng
            </ms-button>
            <ms-button
              v-if="canInactivate"
              type="outline-danger"
              icon="icon_inactive"
              @click="handleUpdateStatusBatch(selectedWorkShifts, false)"
            >
              Ngừng sử dụng
            </ms-button>
            <ms-button
              type="outline-danger"
              icon="icon_trash"
              @click="handleDeleteBatch(selectedWorkShifts)"
            >
              Xóa
            </ms-button>
          </div>
        </div>
        <ms-button
          v-if="!isAnySelected"
          type="outlined"
          icon="icon_reload"
          noMargin="true"
          toolTip="Lấy lại dữ liệu"
          @click="handleReload"
        ></ms-button>
      </div>
      <!-- Body grid -->
      <div class="body-grid relative flex-1 min-h-0 flex flex-col">
        <!-- MSTable -->
        <ms-table
          ref="msTableRef"
          :columns="workShiftColumns"
          :data="workShiftStore.workShifts"
          :loading="isLoading"
          @openEdit="handleOpenEditPopup"
          @doubleClickRow="handleDoubleClickRow"
          @action="handleAction"
          @update:selectedRows="handleSelectedRows"
          @sort="handleSort"
        >
          <template #workShiftStatus="{ rowData }">
            <div class="status-badge" :class="getStatusClass(rowData.workShiftStatus)">
              {{ rowData.workShiftStatus }}
            </div>
          </template>
          <template #workingHours="{ rowData }">
            {{ rowData.workingHours }}
          </template>
          <template #breakHours="{ rowData }">
            {{ rowData.breakHours }}
          </template>
        </ms-table>
        <!-- MSPagination -->
        <ms-pagination
          :totalRecords="workShiftStore.totalRecords"
          :currentPage="workShiftFilterRequest.page"
          :pageSize="workShiftFilterRequest.pageSize"
          @update:currentPage="handlePageChange"
          @update:pageSize="handlePageSizeChange"
        ></ms-pagination>
      </div>
    </div>
  </div>
  <shift-popup
    :isVisible="isShowPopup"
    :initialData="initialData"
    @close="setPopupVisible(false)"
    @save="handleShiftSave"
  ></shift-popup>
</template>
<script setup>
import MsButton from "@/components/ms-button/MsButton.vue";
import MsPagination from "@/components/ms-pagination/MsPagination.vue";
import MsInput from "@/components/ms-input/MsInput.vue";
import MsTable from "@/components/ms-table/MsTable.vue";
import ShiftPopup from "./ShiftPopup.vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import WorkShiftsAPI from "@/apis/components/WorkShiftsAPI";
import { STATUS, STATUS_CODE } from "@/enums/Enum";
import { extractTime, formatDateDDMMYYYY } from "@/utils/DateTimeFns";
import { useWorkShiftStore } from "@/stores/workShiftStore";
import { Modal } from "ant-design-vue";

// store
const workShiftStore = useWorkShiftStore();

// state
const msTableRef = ref(null);
const workShiftColumns = ref([
  { title: "Mã ca", field: "workShiftCode", minWidth: "120px", align: "left", filterable: true },
  { title: "Tên ca", field: "workShiftName", minWidth: "250px", align: "left", filterable: true },
  { title: "Giờ vào ca", field: "startTime", minWidth: "130px", align: "left" },
  { title: "Giờ hết ca", field: "endTime", minWidth: "130px", align: "left" },
  { title: "Bắt đầu nghỉ giữa ca", field: "breakStart", minWidth: "200px", align: "left" },
  { title: "Kết thúc nghỉ giữa ca", field: "breakEnd", wiminWidthth: "200px", align: "left" },
  {
    title: "Thời gian làm việc (giờ)",
    field: "workingHours",
    minWidth: "210px",
    align: "right",
    filterable: true,
  },
  {
    title: "Thời gian nghỉ giữa ca (giờ)",
    field: "breakHours",
    minWidth: "230px",
    align: "right",
    filterable: true,
  },
  {
    title: "Trạng thái",
    field: "workShiftStatus",
    minWidth: "200px",
    align: "left",
    filterable: true,
  },
  { title: "Người tạo", field: "createdBy", minWidth: "160px", align: "left", filterable: true },
  { title: "Ngày tạo", field: "createdDate", minWidth: "160px", align: "left", filterable: true },
  { title: "Ngày sửa", field: "modifiedBy", minWidth: "160px", align: "left", filterable: true },
  {
    title: "Ngày sửa",
    field: "modifiedDate",
    minWidth: "160px",
    align: "left",
    filterable: true,
  },
]);
const isLoading = ref(true);
const keyword = ref("");
let timeoutId = null;
const isShowPopup = ref(false);
const initialData = ref(null);
const selectedWorkShifts = ref([]);
// data
const workShiftFilterRequest = {
  page: 1,
  pageSize: 20,
  keyword: "",
  sortColumn: [],
  filterColumn: [],
};

/**
 * Tính toán row selected
 */
const selectedCount = computed(() => selectedWorkShifts.value.length);
const isAnySelected = computed(() => selectedCount.value > 0);
/**
 * Kiểm tra xem có ca làm việc nào INACTIVE ko
 * Created by: LQThinh (10/12/2025)
 */
const canActivate = computed(() => {
  return selectedWorkShifts.value.some((row) => row.workShiftStatus === STATUS.INACTIVE);
});
/**
 * Kiểm tra xem có ca làm việc nào ACTIVE ko
 * Created by: LQThinh (10/12/2025)
 */
const canInactivate = computed(() => {
  return selectedWorkShifts.value.some((row) => row.workShiftStatus === STATUS.ACTIVE);
});
/**
 * Đóng/mở popup
 * @param value - trạng thái form
 * Created by: LQThinh (09/12/2025)
 */
const setPopupVisible = (value) => {
  isShowPopup.value = value;
};
/**
 * Hàm call api get paging
 * @param payload
 * Created by: LQThinh (06/12/2025)
 */
const getPaging = async (payload) => {
  setLoading(true);
  await nextTick();

  try {
    const response = await WorkShiftsAPI.paging(payload);
    if (response.data.code === STATUS_CODE.OK) {
      const formattedData = response.data.data.map((shift) => {
        return {
          ...shift,
          startTime: extractTime(shift.startTime),
          endTime: extractTime(shift.endTime),
          breakStart: extractTime(shift.breakStart),
          breakEnd: extractTime(shift.breakEnd),
          workShiftStatus: shift.workShiftStatus ? STATUS.ACTIVE : STATUS.INACTIVE,
          createdDate: formatDateDDMMYYYY(shift.createdDate),
          modifiedDate: formatDateDDMMYYYY(shift.modifiedDate),
        };
      });

      workShiftStore.setWorkShifts(formattedData, response.data.meta.totalCount);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API phân trang ca làm việc:", error);
  } finally {
    setLoading(false);
  }
};
/**
 * Hàm call api get by id
 * @param id
 * Created by: LQThinh (09/12/2025)
 */
const getById = async (id) => {
  await nextTick();
  try {
    const response = await WorkShiftsAPI.get(id);
    if (response.data.code === STATUS_CODE.OK) {
      const responseData = response.data.data;
      const formattedData = {
        ...responseData,
        startTime: extractTime(responseData.startTime),
        endTime: extractTime(responseData.endTime),
        breakStart: extractTime(responseData.breakStart),
        breakEnd: extractTime(responseData.breakEnd),
      };
      initialData.value = { ...formattedData };
    }
  } catch (error) {
    console.error("Lấy dữ liệu by Id lỗi: ", error);
  }
};
/**
 * Hàm call api cập nhật trạng thái ca làm việc
 * @param payload
 * Created by: LQThinh (10/12/2025)
 */
const updateStatus = async (payload) => {
  await nextTick();
  try {
    const response = await WorkShiftsAPI.updateMultipleStatus(payload);
    if (response.data.code === STATUS_CODE.OK) {
      if (response.data.data === payload.workShiftIds?.length) {
        workShiftStore.updateStatusBatch(payload);
      }
    }
  } catch (error) {
    console.error("Cập nhật trạng thái lỗi: ", error);
  }
};

/**
 * Hàm call api xóa ca làm việc
 * @param payload
 * Created by: LQThinh (10/12/2025)
 */
const deleteShift = async (payload) => {
  await nextTick();
  try {
    const response = await WorkShiftsAPI.deleteMultiple(payload);
    if (response.data.code === STATUS_CODE.OK) {
      if (response.data.data === payload.workShiftIds?.length) {
        workShiftStore.deleteBatch(payload.workShiftIds);
      }
    }
  } catch (error) {
    console.error("Xóa ca làm việc lỗi: ", error);
  }
};

/**
 * Xử lý khi ca làm việc mới được thêm thành công từ popup
 * @param {object} newShiftData - Dữ liệu ca làm việc mới được trả về từ API
 * Created by: LQThinh (09/12/2025)
 */
const handleShiftSave = (newShiftData) => {
  const formattedShift = {
    ...newShiftData,
    startTime: extractTime(newShiftData.startTime),
    endTime: extractTime(newShiftData.endTime),
    breakStart: extractTime(newShiftData.breakStart),
    breakEnd: extractTime(newShiftData.breakEnd),
    workShiftStatus: newShiftData.workShiftStatus ? STATUS.ACTIVE : STATUS.INACTIVE,
    createdDate: formatDateDDMMYYYY(newShiftData.createdDate),
    modifiedDate: formatDateDDMMYYYY(newShiftData.modifiedDate),
  };

  // check shift tồn tại chưa
  const isUpdating = workShiftStore.workShifts.some(
    (shift) => shift.workShiftId === formattedShift.workShiftId
  );

  if (isUpdating) {
    workShiftStore.updateWorkShift(formattedShift);
  } else {
    workShiftStore.addWorkShift(formattedShift);

    if (workShiftStore.workShifts.length > workShiftFilterRequest.pageSize) {
      workShiftStore.workShifts.pop();
    }
  }
};

/**
 * Hàm set trạng thái loading
 * @param value - trạng thái loading
 * Created by: LQThinh (06/12/2025)
 */
const setLoading = (value) => {
  isLoading.value = value;
};

/**
 * Hàm style cho trạng thái
 * @param status
 * Created by: LQThinh (06/12/2025)
 */
const getStatusClass = (status) => {
  if (status === STATUS.ACTIVE) {
    return "active";
  } else if (status === STATUS.INACTIVE) {
    return "inactive";
  }
  return "";
};

/**
 * Xử lý sự kiện thay đổi trang
 * @param {number} newPage - page mới
 * Created by: LQThinh (06/12/2025)
 */
const handlePageChange = (newPage) => {
  workShiftFilterRequest.page = newPage;
  getPaging(workShiftFilterRequest);
};

/**
 * Xử lý sự kiện thay đổi pageSize
 * @param {number} pageSize - pageSize
 * Created by: LQThinh (06/12/2025)
 */
const handlePageSizeChange = (pageSize) => {
  workShiftFilterRequest.pageSize = pageSize;
  workShiftFilterRequest.page = 1;
  getPaging(workShiftFilterRequest);
};

/**
 * Hàm tìm kiếm theo keyword
 * @param {string} keyword - từ khóa tìm kiếm
 * Created by: LQThinh (06/12/2025)
 */
watch(keyword, (newKeyword) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  setLoading(true);
  timeoutId = setTimeout(() => {
    workShiftFilterRequest.keyword = newKeyword;
    getPaging(workShiftFilterRequest);
  }, 500);
});

/**
 * Hàm reload data
 * Created by: LQThinh (06/12/2025)
 */
const handleReload = () => {
  getPaging(workShiftFilterRequest);
};

/**
 * Hàm mở popup thêm ca làm việc
 * Created by: LQThinh (09/12/2025)
 */
const handleOpenAddPopup = () => {
  initialData.value = null;
  setPopupVisible(true);
};

/**
 * Hàm mở popup sửa ca làm việc
 * @param row - dữ liệu row
 * Created by: LQThinh (09/12/2025)
 */
const handleOpenEditPopup = async (row) => {
  await getById(row.workShiftId);
  setPopupVisible(true);
};

/**
 * Xử lý sự kiện Double-click vào row
 * @param {object} row - row đc click
 * Created by: LQThinh (09/12/2025)
 */
const handleDoubleClickRow = async (row) => {
  await getById(row.workShiftId);
  setPopupVisible(true);
};

/**
 * Xử lý các hành động (Nhân bản, Sử dụng, Xóa)
 * @param {string} action - Hành động được chọn
 * @param {object} row - Dữ liệu của row
 * Created by: LQThinh (10/12/2025)
 */
const handleAction = (action, row) => {
  console.log(action, row);
  switch (action) {
    case "duplicate":
      handleDuplicate(row);
      break;
    case "updateStatus":
      handleUpdateStatus(row);
      break;
    case "delete":
      handleDelete(row);
      break;
    default:
      break;
  }
};

/**
 * Xử lý nhân bản ca làm việc
 * @param {object} row - Dữ liệu của row
 * Created by: LQThinh (10/12/2025)
 */
const handleDuplicate = async (row) => {
  initialData.value = null;
  initialData.value = {
    workShiftName: row.workShiftName,
    startTime: row.startTime,
    endTime: row.endTime,
    breakStart: row.breakStart,
    breakEnd: row.breakEnd,
    workShiftStatus: true,
    description: row.description,
  };
  setPopupVisible(true);
};
/**
 * Xử lý cập nhật trạng thái ca làm việc
 * @param {object} row - Dữ liệu của row
 * Created by: LQThinh (10/12/2025)
 */
const handleUpdateStatus = async (row) => {
  const payload = {
    workShiftIds: [row.workShiftId],
    newStatus: row.workShiftStatus === STATUS.ACTIVE ? false : true,
  };
  await updateStatus(payload);
};
/**
 * Xử lý xóa ca làm việc
 * @param {object} row - Dữ liệu của row
 * Created by: LQThinh (10/12/2025)
 */
const handleDelete = async (row) => {
  const payload = {
    workShiftIds: [row.workShiftId],
  };

  Modal.confirm({
    title: "Xóa Ca làm việc",
    content: `Ca làm việc ${row.workShiftCode} sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?`,
    async onOk() {
      await deleteShift(payload);
    },
    onCancel() {},
    okText: "Xóa",
    okType: "danger",
    cancelText: "Hủy",
    closable: true,
    centered: true,
  });
};
/**
 * Xử lý khi các row được chọn thay đổi
 * @param {Array} rows - các row đã chọn
 * Created by: LQThinh (10/12/2025)
 */
const handleSelectedRows = (rows) => {
  selectedWorkShifts.value = rows;
};
/**
 * Xử lý bỏ chọn tất cả
 * Created by: LQThinh (10/12/2025)
 */
const handleUnselectAll = () => {
  if (msTableRef.value && msTableRef.value.unselectAll) {
    msTableRef.value.unselectAll();
  }
};
/**
 * Hàm cập nhật trạng thái hàng loạt
 * @param selectedWorkShifts - các row đc chọn
 * @param status
 */
const handleUpdateStatusBatch = async (rows, status) => {
  const payload = {
    workShiftIds: rows.map((r) => r.workShiftId),
    newStatus: status,
  };
  await updateStatus(payload);
};
/**
 * Hàm xóa hàng loạt
 * @param selectedWorkShifts - các row đc chọn
 * @param status
 */
const handleDeleteBatch = async (rows) => {
  const payload = {
    workShiftIds: rows.map((r) => r.workShiftId),
  };

  Modal.confirm({
    title: "Xóa Ca làm việc",
    content: `Các ca làm việc sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?`,
    async onOk() {
      await deleteShift(payload);
    },
    onCancel() {},
    okText: "Xóa",
    okType: "danger",
    cancelText: "Hủy",
    closable: true,
    centered: true,
  });
};

const handleSort = async (field, direction) => {
  if (direction === "NONE") {
    const index = workShiftFilterRequest.sortColumn.findIndex((item) => item.selector === field);
    if (index > -1) {
      workShiftFilterRequest.sortColumn.splice(index, 1);
    }
  } else {
    workShiftFilterRequest.sortColumn.push({
      selector: field,
      desc: direction === "DESC",
    });
  }

  console.log(workShiftFilterRequest);
};

/**
 * Gọi API khi component được mount
 */
onMounted(() => {
  getPaging(workShiftFilterRequest);
});
</script>

<style scoped>
.title-box {
  height: 30px;
}
.tool-box {
  height: 44px;
  padding: 8px 16px;
  background: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.status-badge {
  height: 26px;
  display: flex;
  align-items: center;
  width: fit-content;
}
.status-badge.active {
  background-color: #ebfef6;
  color: #009b71;
  padding: 5px 8px;
  border-radius: 999px;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 5px 8px;
  border-radius: 999px;
}
</style>
