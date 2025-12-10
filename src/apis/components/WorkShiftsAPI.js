import api from '@/apis/config/APIConfig.js';
import BaseAPI from '@/apis/base/BaseAPI.js';

class WorkShiftsAPI extends BaseAPI {
    constructor(){
        super();
        this.controller = "WorkShift";
    }

    /**
     * Hàm kiểm tra trùng lặp theo nghiệp vụ riêng
     * @param {*} payload 
     * @returns 
     */
    checkDuplicate(payload) {
        return api.post(`${this.controller}/check-duplicate`, payload);
    }
    /**
     * Hàm cập nhật trạng thái nhiều bản ghi
     * @param {*} payload 
     * @returns số lượng bản ghi được cập nhật
     * Created by: LQThinh (10/12/2025)
     */
    updateMultipleStatus(payload) {
        return api.post(`${this.controller}/update_status`, payload);
    }
    /**
     * Hàm xóa nhiều bản ghi
     * @param {*} payload 
     * @returns số lượng bản ghi vừa xóa
     * Created by: LQThinh (10/12/2025)
     */
    deleteMultiple(payload) {
        return api.post(`${this.controller}/delete`, payload);
    }
}

export default new WorkShiftsAPI();