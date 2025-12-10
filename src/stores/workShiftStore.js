import { STATUS } from '@/enums/Enum';
import { defineStore } from 'pinia';

export const useWorkShiftStore = defineStore('workShift', {
  state: () => ({
    workShifts: [],
    totalRecords: 0,
  }),
  actions: {
    /**
     * Thiết lập danh sách ca làm việc và tổng số bản ghi
     * @param {Array} data - Dữ liệu danh sách ca
     * @param {number} total - Tổng số bản ghi
     * Created by: LQThinh (08/12/2025)
     */
    setWorkShifts(data, total) {
      this.workShifts = data;
      this.totalRecords = total;
    },

    /**
     * Thêm một ca làm việc mới vào đầu danh sách
     * @param {Object} newShift - Dữ liệu ca làm việc mới
     * Created by: LQThinh (08/12/2025)
     */
    addWorkShift(newShift) {
      this.workShifts = [newShift, ...this.workShifts];
      this.totalRecords++;
    },
    /**
     * Cập nhật một ca làm việc trong danh sách
     * @param {Object} updatedShift - Dữ liệu ca làm việc đã cập nhật
     * Created by: LQThinh (09/12/2025)
     */
    updateWorkShift(updatedShift) {
      const index = this.workShifts.findIndex(
        (shift) => shift.workShiftId === updatedShift.workShiftId
      );
      
      if (index !== -1) {
        this.workShifts[index] = { ...updatedShift };
      }
    },
    /**
     * Cập nhật trạng thái nhiều ca làm việc
     * @param {*} payload 
     * Created by: LQThinh (10/12/2025)
     */
    updateStatusBatch(payload) {
      const idSet = new Set(payload.workShiftIds);
      this.workShifts.forEach(shift => {
        if (idSet.has(shift.workShiftId)) {
          if (payload.newStatus) {
            shift.workShiftStatus = STATUS.ACTIVE;
          }
          else {
            shift.workShiftStatus = STATUS.INACTIVE;
          }
        }
      });
    },
    /**
     * Xóa nhiều ca làm việc
     * @param {*} ids 
     * Created by: LQThinh (10/12/2025)
     */
    deleteBatch(ids) {
      const idSet = new Set(ids);
      this.workShifts = this.workShifts.filter(shift => !idSet.has(shift.workShiftId));
      this.totalRecords -= ids.length;
    },

  },
});