
/* eslint-disable no-template-curly-in-string */
export const validateMessages = {
    required: 'Thông tin bắt buộc!',
    types: {
        email: 'Không đúng định dạng',
        number: '${label} phải là kiểu số',
    },
    number: {
        range: '${label} cần nằm trong khoảng ${min} và ${max}',
    },
};

export const controlerRule = {
    phone: {
        minLength: {
            value: 9,
            message: "Số không hợp lệ",
        },
        pattern: {
            value: /^(?:\s*\d\s*){6,12}$/,
            message: "Số không hợp lệ",
        },
    },
    email: {
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email không hợp lệ",
        },
    }
}