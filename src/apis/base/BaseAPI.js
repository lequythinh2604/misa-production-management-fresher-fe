import api from '@/apis/config/APIConfig.js';

export default class BaseAPI {
    constructor() {
        this.controller = null;
    }
    /**
     * Phương thức lấy tất cả dữ liệu
     */
    getAll() {
        return api.get(`${this.controller}`);
    }
    /**
     * Hàm lấy dữ liệu phân trang
     * @param {*} payload 
     */
    paging(payload) {
        return api.post(`${this.controller}/paging`, payload);
    }
    /**
     * Hàm lấy dữ liệu theo id
     * @param {*} id 
     */
    get(id) {
        return api.get(`${this.controller}/${id}`);
    }
    /**
     * Hàm thêm dữ liệu
     * @param {*} payload
     */
    add(payload) {
        return api.post(`${this.controller}`, payload);
    }
    /**
     * Hàm cập nhật dữ liệu
     * @param {*} id 
     * @param {*} body 
     */
    update(id, body) {
        return api.put(`${this.controller}/${id}`, body);
    }
    /**
     * Hàm xóa bản ghi
     * @param {*} id
     */
    delete(id) {
        return api.delete(`${this.controller}/${id}`);
    }
}