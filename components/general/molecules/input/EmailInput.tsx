'use client';

import LoginInput from "../../atoms/LoginInput";

const EmailInput: React.FC<any> = ({ className = '' }) => {
    return (
        <LoginInput
            placeholder="Nhập email"
            iconUrl="/assets/icons/login-email.svg"
            name='email'
            className={className}
        />
    );
};

export default EmailInput;
