'use client';

import LoginInput from "../../atoms/LoginInput";

const PasswordInput: React.FC<any> = ({ className = '', confirm = false, placeholder = "Nhập mật khẩu" }) => {
    return (
        <LoginInput
            placeholder={placeholder}
            iconUrl="/assets/icons/lock.svg"
            isPasswordInput
            maxLength={30}
            name={confirm ? 'password_confirmation' : 'password'}
            className={className}
        />
    );
};

export default PasswordInput;
