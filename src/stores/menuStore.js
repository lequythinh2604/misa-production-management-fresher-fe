import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    openEndpoint: '',
  }),
  actions: {
    /**
     * Chuyển đổi trạng thái mở/đóng của sub-menu
     * Nếu endpoint hiện tại đang mở, nó sẽ đóng lại và ngược lại
     * @param {string} endpoint - Endpoint của menu item.
     * Created by ThinhLQ - 2/12/2025
     */
    toggleOpenEndpoint(endpoint) {
      if (this.openEndpoint === endpoint) {
        this.openEndpoint = '';
      } else {
        this.openEndpoint = endpoint;
      }
    },
  },
});