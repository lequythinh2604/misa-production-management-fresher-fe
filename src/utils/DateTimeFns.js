/**
 * Hàm trợ giúp để trích xuất HH:mm từ chuỗi datetime
 * @param {string} datetimeString - Chuỗi ISO 8601 (VD: "YYYY-MM-DDTHH:mm:ss")
 * @returns {string} - Chuỗi thời gian (VD: "HH:mm")
 * Created by: LQThinh (06/12/2025)
 */
export const extractTime = (datetimeString) => {
  try {
    if (!datetimeString) return "";
    const timePart = datetimeString.split("T")[1];
    if (timePart) {
      return timePart.substring(0, 5); // Lấy HH:mm
    }
    return "";
  } catch (error) {
    console.error("Lỗi format thời gian:", error);
    return "";
  }
};

/**
* Hàm chuyển đổi Giờ:Phút thành chuỗi ISO 8601
* @param {string} timeString - HH:MM
* @returns {string} Chuỗi ISO 8601
*/
export const convertTimeToISO = (timeString) => {
    if (!timeString) return null;
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    return `${dateString}T${timeString}:00.000Z`;
};

/**
 * Chuyển đổi chuỗi ngày tháng định dạng ISO (YYYY-MM-DDTHH:mm:ss) sang DD/MM/YYYY.
 * @param {string} isoDateString - Chuỗi ngày tháng ISO.
 * @returns {string} Ngày tháng đã định dạng (DD/MM/YYYY)
 */
export const formatDateDDMMYYYY = (isoDateString) => {
  if (!isoDateString) return "";

  try {
    const datePart = isoDateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    
    if (year && month && day) {
        return `${day}/${month}/${year}`;
    }

    return "";
  } catch (error) {
    console.error("Lỗi khi định dạng ngày:", error);
    return "";
  }
};