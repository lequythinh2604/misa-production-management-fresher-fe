/**
 * Các điều kiện lọc text
 * Created by: LQThinh (11/12/2025)
 */
export const TEXT_CONDITION_OPTIONS = [
  { label: "(Trống)", value: "isnull" },
  { label: "(Không trống)", value: "notnull" },
  { label: "Bằng", value: "=" },
  { label: "Khác", value: "<>" },
  { label: "Chứa", value: "contains", selected: true },
  { label: "Không chứa", value: "notcontains" },
  { label: "Bắt đầu với", value: "startswith" },
  { label: "Kết thúc với", value: "endswith" },
];
/**
 * Các điều kiện lọc number
 * Created by: LQThinh (11/12/2025)
 */
export const NUMBER_CONDITION_OPTIONS = [
  { label: "Bằng", value: "=", selected: true },
  { label: "Khác", value: "<>" },
  { label: "Nhỏ hơn", value: "<" },
  { label: "Nhỏ hơn hoặc bằng", value: "<=" },
  { label: "Lớn hơn", value: ">" },
  { label: "Lớn hơn hoặc bằng", value: ">=" },
  { label: "(Trống)", value: "isnull" },
  { label: "(Không trống)", value: "notnull" },
];
/**
 * Các điều kiện lọc trạng thái
 * Created by: LQThinh (11/12/2025)
 */
export const STATUS_CONDITION_OPTIONS = [
  { label: "Đang sử dụng", value: "ACTIVE" },
  { label: "Ngừng sử dụng", value: "INACTIVE" },
];