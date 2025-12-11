/**
 * Lấy label tương ứng với value từ một mảng options.
 * @param {Array<Object>} options - mảng các đối tượng options
 * @param {string|number} value - value cần tìm label
 * @param {string} keyField - tên trường chứa value
 * @param {string} labelField - tên trường chứa label
 * @returns {string} label tương ứng, hoặc chuỗi trống nếu không tìm thấy
 * Created by: LQThinh (11/12/2025)
 */
export function getLabelByValue(options, value, keyField = 'value', labelField = 'label') {
    if (!options || !Array.isArray(options)) {
        return '';
    }
    
    const option = options.find(item => item[keyField] === value);
    return option ? option[labelField] : '';
}