<template>
  <div v-if="isVisible" class="bg-overlay fixed inset-0 flex justify-center items-center z-1000">
    <!-- popup container -->
    <div v-if="isLoading" class="bg-overlay absolute inset-0 flex justify-center items-center z-20">
      <svg
        class="animate-spin h-8 w-8 text-teal-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div
      ref="popup"
      class="w-[680px] bg-white rounded-lg shadow-xl min-w-2xl max-w-3xl transform transition-all overflow-hidden"
      @keydown.esc="handleClose"
      role="dialog"
      aria-modal="true"
    >
      <!-- popup header -->
      <div class="h-[68px] flex justify-between items-center px-5 py-4">
        <h2 class="text-2xl font-bold">{{ isEdit ? "Sửa" : "Thêm" }} Ca làm việc</h2>
        <div class="flex items-center gap-2">
          <ms-button
            type="text"
            icon="icon_help"
            iconSize="20"
            no-margin
            no-padding
            @click="handleHelp"
          ></ms-button>
          <ms-button
            type="text"
            icon="icon_close"
            iconSize="20"
            no-margin
            no-padding
            @click="handleClose"
          ></ms-button>
        </div>
      </div>
      <!-- popup body -->
      <div class="p-5">
        <div class="form-group">
          <ms-input
            ref="firstInput"
            v-model="formData.workShiftCode"
            label="Mã ca"
            tabIndex="1"
            required
            :isError="!formData.workShiftCode"
            maxLength="20"
          ></ms-input>
        </div>

        <div class="form-group">
          <ms-input
            v-model="formData.workShiftName"
            label="Tên ca"
            tabIndex="2"
            required
            :isError="!formData.workShiftName"
            maxLength="50"
          ></ms-input>
        </div>

        <!-- working time -->
        <div class="flex gap-9">
          <div class="form-group w-1/2">
            <ms-time-picker
              v-model="formData.startTime"
              label="Giờ vào ca"
              required
              tabIndex="3"
              width="w-[122px]"
              :isError="!formData.startTime"
            ></ms-time-picker>
          </div>
          <div class="form-group w-1/2">
            <ms-time-picker
              v-model="formData.endTime"
              label="Giờ hết ca"
              required
              tabIndex="4"
              width="w-[122px]"
              :isError="!formData.endTime"
            ></ms-time-picker>
          </div>
        </div>

        <!-- breaking time -->
        <div class="flex gap-9">
          <div class="form-group w-1/2">
            <ms-time-picker
              v-model="formData.breakStart"
              label="Bắt đầu nghỉ giữa ca"
              tabIndex="5"
              width="w-[122px]"
            ></ms-time-picker>
          </div>
          <div class="form-group w-1/2">
            <ms-time-picker
              v-model="formData.breakEnd"
              label="Kết thúc nghỉ giữa ca"
              tabIndex="6"
              width="w-[122px]"
            ></ms-time-picker>
          </div>
        </div>

        <div class="flex gap-9">
          <div class="form-group w-1/2">
            <ms-input
              v-model="formData.workingHours"
              label="Thời gian làm việc (giờ)"
              width="w-[122px]"
              justify="between"
              tabIndex="-1"
              isDisabled
              placeholderAlign="right"
              :isWarning="isWarning"
            ></ms-input>
          </div>
          <div class="form-group w-1/2">
            <ms-input
              v-model="formData.breakHours"
              label="Thời gian nghỉ giữa ca (giờ)"
              width="w-[122px]"
              justify="between"
              tabIndex="-1"
              isDisabled
              placeholderAlign="right"
            ></ms-input>
          </div>
        </div>
        <div class="form-group">
          <ms-textarea v-model="formData.description" label="Mô tả" tabIndex="7"></ms-textarea>
        </div>

        <div v-if="isEdit" class="flex">
          <label class="ms-input-label">Trạng thái</label>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio h-4 w-4 text-teal-600 border-gray-300"
                name="status"
                value="true"
                v-model="formData.workShiftStatus"
                tabindex="8"
              />
              <span class="ml-2 text-sm text-gray-700">Đang sử dụng</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio h-4 w-4 text-teal-600 border-gray-300"
                name="status"
                value="false"
                v-model="formData.workShiftStatus"
                tabindex="9"
              />
              <span class="ml-2 text-sm text-gray-700">Ngừng sử dụng</span>
            </label>
          </div>
        </div>
      </div>

      <div class="action-container flex justify-end gap-2 px-5 py-3">
        <ms-button type="outlined" @click="handleCancel" tabIndex="12">Hủy</ms-button>
        <ms-button
          type="outlined"
          toolTip="Ctrl + Shift + S"
          @click="handleSaveAndAdd"
          tabIndex="11"
        >
          Lưu và Thêm
        </ms-button>
        <ms-button toolTip="Ctrl + S" @click="handleSave" tabIndex="10"> Lưu </ms-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  defineProps,
  defineEmits,
  watch,
  computed,
  nextTick,
  onUnmounted,
} from "vue";
import MsButton from "@/components/ms-button/MsButton.vue";
import MsInput from "@/components/ms-input/MsInput.vue";
import MsTimePicker from "@/components/ms-timepicker/MsTimePicker.vue";
import MsTextarea from "@/components/ms-textarea/MsTextarea.vue";
import { convertTimeToISO } from "@/utils/dateTimeFns";
import WorkShiftsAPI from "@/apis/components/WorkShiftsAPI";
import { STATUS_CODE } from "@/enums/Enum";
import { message, Modal } from "ant-design-vue";

// props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => null,
  },
});

// emits
const emit = defineEmits(["close", "save", "saveAndAdd"]);

// state
const formData = ref({
  workShiftCode: null,
  workShiftName: null,
  startTime: null,
  endTime: null,
  breakStart: null,
  breakEnd: null,
  workingHours: null,
  breakHours: null,
  workShiftStatus: true,
  description: null,
});
const firstInput = ref(null);
const popup = ref(null);
const isLoading = ref(false);
const isClose = ref(false);
const isWarning = ref(false);

/**
 * Tính mode(thêm, sửa) cho popup
 * Created by: LQThinh (08/12/2025)
 */
const isEdit = computed(() => !!props.initialData?.workShiftId);

/**
 * Hàm tính toán thời gian
 * @param start
 * @param end
 * Created by: LQThinh (08/12/2025)
 */
const calculateDuration = (start, end) => {
  if (!start || !end) return "";
  try {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startDate = new Date(2000, 0, 1, startH, startM);
    let endDate = new Date(2000, 0, 1, endH, endM);

    // nếu end < start, thêm 1 ngày
    if (endDate < startDate) {
      endDate = new Date(endDate.setDate(endDate.getDate() + 1));
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(2).replace(/\.?0+$/, ""); // Bỏ số 0 thừa
  } catch {
    return "";
  }
};

/**
 * Theo dõi và tính toán thời gian
 * @param startTime
 * @param endTime
 * @param breakStart
 * @param breakEnd
 * Created by: LQThinh (08/12/2025)
 */
watch(
  () => [
    formData.value.startTime,
    formData.value.endTime,
    formData.value.breakStart,
    formData.value.breakEnd,
  ],
  () => {
    // Tính tổng thời gian ca làm việc
    const totalShiftDuration = calculateDuration(formData.value.startTime, formData.value.endTime);

    // Tính tổng thời gian nghỉ giữa ca
    const totalBreakDuration = calculateDuration(
      formData.value.breakStart,
      formData.value.breakEnd
    );
    formData.value.breakHours = totalBreakDuration || "0";

    // Tính thời gian làm việc thực tế: Tổng ca - Tổng nghỉ
    if (totalShiftDuration && totalBreakDuration) {
      const workHours = parseFloat(totalShiftDuration) - parseFloat(totalBreakDuration);
      if (workHours < 0) {
        formData.value.workingHours =
          "(" +
          Math.abs(workHours)
            .toFixed(2)
            .replace(/\.?0+$/, "") +
          ")";
        isWarning.value = true;
      } else {
        formData.value.workingHours = workHours.toFixed(2).replace(/\.?0+$/, "");
        isWarning.value = false;
      }
    } else {
      formData.value.workingHours = totalShiftDuration;
    }
  },
  { immediate: true }
);

/**
 * Khởi tạo dữ liệu khi popup được mở
 * @param props.isVisible
 * Created by: LQThinh (06/12/2025)
 */
watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      // Khởi tạo dữ liệu
      if (props.initialData) {
        formData.value = { ...props.initialData };
      }
      // Reset về giá trị mặc định cho "Thêm mới"
      else {
        formData.value = {
          workShiftCode: null,
          workShiftName: null,
          startTime: null,
          endTime: null,
          breakStart: null,
          breakEnd: null,
          workingHours: null,
          breakHours: null,
          workShiftStatus: true,
          description: null,
        };
      }

      nextTick(() => {
        if (popup.value) {
          popup.value.focus();
        }
        // focus vào input đầu tiên
        nextTick(() => {
          const inputElement = firstInput.value?.$el?.querySelector("input");
          if (inputElement) {
            inputElement.focus();
          }
        });
      });
    }
  },
  { immediate: true }
);

/**
 * Hàm set trạng thái loading
 * @param value - trạng thái loading
 * Created by: LQThinh (06/12/2025)
 */
const setLoading = (value) => {
  isLoading.value = value;
};

/**
 * Hàm call API thêm ca làm việc
 * @param {object} formData - dữ liệu client
 * Created by: LQThinh (08/12/2025)
 */
const addNewWorkShift = async (formData) => {
  setLoading(true);
  try {
    const payload = {
      workShiftCode: formData.value.workShiftCode,
      workShiftName: formData.value.workShiftName,
      description: formData.value.description,
      startTime: convertTimeToISO(formData.value.startTime) || null,
      endTime: convertTimeToISO(formData.value.endTime) || null,
      breakStart: convertTimeToISO(formData.value.breakStart) || null,
      breakEnd: convertTimeToISO(formData.value.breakEnd) || null,
      workingHours: parseFloat(formData.value.workingHours) || 0,
      breakHours: parseFloat(formData.value.breakHours) || 0,
      workShiftStatus: formData.value.workShiftStatus,
    };

    const response = await WorkShiftsAPI.add(payload);
    if (response.data.code === STATUS_CODE.OK) {
      message.success(response.data.userMessage || "");
      emit("save", response.data.data);
      if (isClose.value) {
        handleClose();
      } else {
        resetForm();
      }
    }
  } catch (error) {
    console.error("Lỗi khi gọi API thêm ca làm việc:", error);
    const errorData = error.response.data;
    if (errorData.Code === STATUS_CODE.VALIDATION || errorData.Code === STATUS_CODE.CONFLICT) {
      const errorMess = Object.values(errorData.ValidateInfo);
      Modal.warning({
        title: "Cảnh báo",
        content: errorMess[0],
        okText: "Đóng",
        centered: true,
      });
    }
  } finally {
    setLoading(false);
  }
};

/**
 * Hàm call API sửa ca làm việc
 * @param {string} id - id ca làm việc
 * @param {object} formData - dữ liệu client
 * Created by: LQThinh (08/12/2025)
 */
const updateWorkShift = async (id, formData) => {
  setLoading(true);
  try {
    const payload = {
      workShiftCode: formData.value.workShiftCode,
      workShiftName: formData.value.workShiftName,
      description: formData.value.description,
      startTime: convertTimeToISO(formData.value.startTime),
      endTime: convertTimeToISO(formData.value.endTime),
      breakStart: convertTimeToISO(formData.value.breakStart),
      breakEnd: convertTimeToISO(formData.value.breakEnd),
      workingHours: parseFloat(formData.value.workingHours) || 0,
      breakHours: parseFloat(formData.value.breakHours) || 0,
      workShiftStatus: JSON.parse(formData.value.workShiftStatus),
    };

    const response = await WorkShiftsAPI.update(id, payload);
    if (response.data.code === STATUS_CODE.OK) {
      message.success(response.data.userMessage || "");
      emit("save", response.data.data);
      if (isClose.value) {
        handleClose();
      } else {
        resetForm();
      }
    }
  } catch (error) {
    console.error("Lỗi khi gọi API sửa ca làm việc:", error);
    const errorData = error.response.data;
    if (errorData.Code === STATUS_CODE.VALIDATION || errorData.Code === STATUS_CODE.CONFLICT) {
      const errorMess = Object.values(errorData.ValidateInfo);
      Modal.warning({
        title: "Cảnh báo",
        content: errorMess[0],
        okText: "Đóng",
        centered: true,
      });
    }
  } finally {
    setLoading(false);
  }
};

/**
 * Hàm reset form
 * Created by: LQThinh (09/12/2025)
 */
const resetForm = () => {
  // Giữ popup mở và reset form
  formData.value = {
    workShiftCode: null,
    workShiftName: null,
    startTime: null,
    endTime: null,
    breakStart: null,
    breakEnd: null,
    workingHours: null,
    breakHours: null,
    workShiftStatus: true,
    description: null,
  };
  // focus input đầu
  nextTick(() => {
    const inputElement = firstInput.value?.$el?.querySelector("input");
    if (inputElement) {
      inputElement.focus();
    }
  });
};

/**
 * Validate form
 * Created by: LQThinh (08/12/2025)
 */
const validateForm = () => {
  return (
    formData.value.workShiftCode &&
    formData.value.workShiftName &&
    formData.value.startTime &&
    formData.value.endTime
  );
};

/**
 * Hàm thêm ca làm viêc
 * Created by: LQThinh (08/12/2025)
 */
const handleSave = () => {
  isClose.value = true;
  if (isEdit.value) {
    const id = props.initialData?.workShiftId || "";
    updateWorkShift(id, formData);
  } else {
    addNewWorkShift(formData);
  }
};

/**
 * Hàm save bằng Ctrl + S và Ctrl + Shift + S
 * @param event - sự kiện keydown
 * Created by: LQThinh (09/12/2025)
 */
const handleSaveShortcut = (event) => {
  const isSaveKey = event.key === "s" || event.key === "S";
  const isModifierPressed = event.ctrlKey || event.metaKey;

  if (isSaveKey && isModifierPressed) {
    event.preventDefault();

    if (event.shiftKey) {
      handleSaveAndAdd();
    } else {
      handleSave();
    }
  }
};

/**
 * Hàm thêm ca và reload popup
 * Created by: LQThinh (08/12/2025)
 */
const handleSaveAndAdd = () => {
  isClose.value = false;
  if (isEdit.value) {
    const id = props.initialData?.workShiftId || "";
    updateWorkShift(id, formData);
  } else {
    addNewWorkShift(formData);
  }
};

/**
 * Hàm đóng popup
 * Created by: LQThinh (08/12/2025)
 */
const handleCancel = () => {
  emit("close");
};

/**
 * Hàm đóng popup
 * Created by: LQThinh (08/12/2025)
 */
const handleClose = () => {
  emit("close");
};

/**
 * Hàm mở trợ giúp
 */
const handleHelp = () => {
  alert("Chức năng trợ giúp đang trong quá trình phát triển");
};

/**
 * lifecycle
 */
onMounted(() => {
  window.addEventListener("keydown", handleSaveShortcut);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleSaveShortcut);
});
</script>

<style scoped>
.bg-overlay {
  background-color: #0000004d;
}
.custom-border-style {
  border: 1px solid #d1d5db;
  transition: border-color 0.15s ease-in-out;
}
.custom-border-style:hover {
  border-color: #9ca3af !important;
}
.custom-border-style:focus-within,
.custom-border-style:focus {
  border-color: #009b71 !important;
  outline: none;
  box-shadow: none;
}
.form-group {
  margin-bottom: 16px;
}
.form-group:last-child {
  margin-bottom: 0;
}
.ms-input-label {
  width: 180px;
  color: #262626;
  font-weight: 500;
  font-size: 13px;
}
.action-container {
  height: 52px;
  border-top: 1px solid #d5dfe2;
}
</style>
