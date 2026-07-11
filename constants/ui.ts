import { HCM_CODE, HN_CODE } from "./listing";

export const LANG = 'vi';
export const VI_LOCALE = 'vi';
export const VI_DATE_FORMAT = 'DD/MM/YYYY';
export const VI_SHORT_DATE_FORMAT = 'MM/YYYY';
export const VI_DATE_WITH_SHORT_YEAR_FORMAT = 'DD/MM/YY';
export const HORIZONTAL_VIEW = 'HORIZONTAL';
export const VERTICAL_VIEW = 'VERTICAL';
export const NOT_UPDATED_INFORMATION = 'Chưa cập nhật';
export const MODAL_LAYOUT_HORIZONTAL = "horizontal";
export const MODAL_LAYOUT_VERTICAL = "vertical";
export const SORT_BY_DAY_NUMBER = 'DAY_NUMBER';
export const SORT_BY_FLIGHT_DATE = 'FLIGHT_DATE';
export const SORT_BY_PRICE = 'PRICE';
export const HOT_ICON_TITLE = 'HOT_TITLE';
export const PLANE_ICON_TITLE = 'PLANE_TITLE';
export const IS_ACTIVE = 'Cho phép hiển thị';
export const NOT_ACTIVE = 'Không cho phép hiển thị';

export const IS_PUSH_SALE = 'Có';
export const NOT_PUSH_SALE = 'Không';

/** Button */
export const TEXT_BTN_ADD = 'Thêm';
export const TEXT_BTN_REMOVE = 'Xóa';
export const TEXT_BTN_CREATE = 'Lưu';
export const TEXT_BTN_UPDATE = 'Cập nhật';
export const TEXT_BTN_INFO = 'Chi tiết';
export const TEXT_BTN_DELETE = 'Xóa';
export const TEXT_BTN_DELETE_DRAFT = 'Xóa nháp';
export const TEXT_BTN_RESTORE = 'Khôi phục';
export const TEXT_BTN_REFRESH = 'Làm mới';
export const TEXT_BTN_PICTURE = 'Hình ảnh';
export const TEXT_BTN_HISTORY = 'Lịch sử';
export const TEXT_BTN_COMMENT = 'Quản lý đánh giá';
export const TEXT_BTN_POST = 'Quản lý bài viết';
export const TEXT_MANNAGE_MARKET_TOUR = 'Quản lý thị trường/tour';
export const TEXT_MANNAGE_TAG_SLUG = 'Quản lý tag/bài viết';
export const DROPDOWN_PLACEHOLDER = 'Lựa chọn';
export const DEFAULT_THUMBNAIL = '/assets/images/empty.jpg';
export const DEFAULT_BANNER = '/assets/images/sub-banner-1.png';
export const DEFAULT_VOUCHER = '/assets/images/voucher.png';

export const EMPTY_IMAGE = '/assets/images/empty.jpg';
export const DEFAULT_SLIDER = [
    { url: '/assets/images/banner-slider-1.png', },
    { url: '/assets/images/banner-slider-2.png', }
]

export const responseMessages: { [key: string]: string } = {
    //destination
    destination_not_found: 'Không tìm thấy điểm đến',
    destination_updated_by_others: 'Điểm đến đã bị thay đổi bởi người khác',
    destination_stored_success: 'Thêm mới điểm đến thành công',
    destination_updated_success: 'Cập nhật điểm đến thành công',

    //market
    market_name_existed: 'Tên tuyến tour đã tồn tại',
    market_not_found: 'Không tìm thấy tuyến tour',
    market_updated_by_others: 'Tuyến tour đã bị thay đổi bởi người khác',

    //nation
    nation_name_existed: 'Tên quốc gia đã tồn tại',
    nation_not_found: 'Không tìm thấy quốc gia',
    nation_updated_success: 'Cập nhật quốc gia thành công',

    //tour
    tour_not_found: 'Không tìm thấy tour',
    push_sale_price_too_big: 'Giá push sale không được lớn hơn giá bán',
    update_price_success: 'Cập nhật giá thành công',
    series_code_existed: 'Mã tour đã tồn tại',

    //topic
    topic_not_found: 'Không tìm thấy chủ đề',

    //redirect
    url_from_existed: 'Url này đã được redirect',

    name_existed: 'Tên đã tồn tại',
    slug_existed: 'Slug đã tồn tại',
    slug_empty: 'Slug đang để trống',
    error_while_update_slug: 'Có lỗi xảy ra khi cập nhật Slug',
    updated_by_others: 'Thông tin đã bị thay đổi bởi người khác',
    image_not_found: 'Không tìm thấy hình ảnh',
    record_not_found: 'Không tìm thấy dữ liệu',
    record_updated_by_others: 'Dữ liệu đã bị thay đổi bởi người khác',
    fill_required_infomation: 'Vui lòng nhập đầy đủ thông tin',

    create_failed: 'Tạo không thành công',
    update_failed: 'Cập nhật không thành công',
    delete_failed: 'Xóa không thành công',
    server_error: 'Lỗi hệ thống',
    error: 'Lỗi hệ thống',

    create_success: 'Tạo thành công',
    delete_success: 'Xoá thành công',
    update_success: 'Cập nhật thành công',
    store_success: 'Lưu thành công',
    active_success: 'Cập nhật trạng thái thành công',
    success: 'Thành công',

    restore_success: 'Khôi phục thành công',

    admin_success_login: 'Đăng nhập thành công. Đang chuyển hướng.',

    //guest
    login_successfully: 'Đăng nhập thành công',
    register_successfully: 'Đăng ký thành công',
    reset_password_successfully: 'Cập nhật mật khẩu thành công',
    login_unsuccessfully: 'Đăng nhập không thành công',
    invalid_credential: 'Truy cập ngoài quyền hạn',
    account_not_active: 'Tài khoản chưa được kích hoạt',
    account_not_found: 'Tài khoản không tồn tại',
    email_not_found: 'Email không tồn tại',
    email_existed: 'Email đã tồn tại',
    phone_existed: 'Số điện thoại đã tồn tại',
    sending_reset_password_email: 'Email thay đổi mật khẩu đang được gửi, vui lòng kiểm tra mail của bạn',
    unauthorized: 'Chưa đăng nhập',

    'passwords.token': 'Link thay đổi mật khẩu đã bị hết hạn vui lòng thử lại.',
    'passwords.user': 'Email không chính xác.',
    store_comment_success: 'Cảm ơn bạn đã để lại bình luận',
    email_or_password_not_correct: 'Thông tin đăng nhập không chính xác',

    booking_successfully: 'Đặt tour thành công chúng tôi sẽ liên hệ bạn trong thời gian ngắn',
    booking_unsuccessfully: 'Đặt tour không thành công vui lòng thử lại sau',
    not_enough_seats: 'Không còn đủ chỗ trống!',
    support_request_success: 'Yêu cầu tư vấn thành công, chúng tôi sẽ liên hệ bạn trong thời gian ngắn',
    //error name
    name: 'Tên',
    phone: 'Số điện thoại',
    email: 'Email',

    /** title Type  */
    success_title: 'Thành công',
    info_title: 'Thông tin',
    error_title: 'Lỗi',
    warning_title: 'Thông báo',

    /** Auth */
    permission_denied: 'Bạn không đủ phân quyền hoặc phân quyền đã bị thay đổi. Hệ thống sẽ tải lại trang để cập nhật thông tin.',
    missing_token: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.',
    not_found_token: 'Bạn đã đăng nhập ở nơi khác hoặc một trình duyệt web khác, để tiếp tục sử dụng vui lòng đăng nhập lại.',
}

export const commonCkeditorTabFields = [
    { key: 'description', label: 'Mô tả' },
    { key: 'question', label: 'Câu hỏi thường gặp', showSection: true },
    { key: 'info', label: 'Thông tin chi tiết', showSummary: true },
];

export const marketCkeditorTabFields = [
    { key: 'introduction', label: 'Đặc sắc' },
    { key: 'description', label: 'Thông tin chuyến đi', showSection: true },
    { key: 'price_inclusive_of_info', label: 'Giá bao gồm' },
    { key: 'price_exclusive_of', label: 'Giá không bao gồm' },
    { key: 'additional_charge_info', label: 'Phụ thu' },
    { key: 'cancel_or_change_info', label: 'Hủy / Đổi' },
    { key: 'visa_info', label: 'Thông tin visa' },
    { key: 'other_info', label: 'Thông tin khác' }
];

export const TOPIC_TYPE_FLASH_SALE = 'FLASH_SALE';
export const TOPIC_TYPE_HOT = 'HOT';

export const FROM_LIST = [
    { label: 'Tp.Hồ Chí Minh ', value: HCM_CODE, shortName: 'Tp. HCM' },
    { label: 'Hà Nội', value: HN_CODE, shortName: 'Hà Nội' }
]

export const ratings = [
    { label: 'Tuyệt vời', value: 5 },
    { label: 'Rất tốt', value: 4 },
    { label: 'Hài lòng', value: 3 },
    { label: 'Trung bình', value: 2 },
    { label: 'Kém', value: 1 },
];
export const NUMBER_OF_SPIN = 1;

export const HIGHLIGHT_TYPE_SAVE = 'SAVE';
export const HIGHLIGHT_TYPE_BEST_SELLER = 'BEST_SELLER';
export const HIGHLIGHT_TYPE_HOT = 'HOT';
export const HIGHLIGHT_TYPE_GOOD_PRICE = 'GOOD_PRICE';