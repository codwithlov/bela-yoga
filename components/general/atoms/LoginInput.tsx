import { useState } from 'react';
import { EyeTwoTone, EyeInvisibleTwoTone } from '@ant-design/icons';
// import '@/styles/components/input.scss';
import { Form } from 'antd';

interface LoginInputProps {
    placeholder: string;
    iconUrl: string;
    isPasswordInput?: boolean;
    maxLength?: number;
    name?: string;
    className?: string;
    required?: boolean;
}

const LoginInput: React.FC<LoginInputProps> = ({
    placeholder,
    iconUrl,
    isPasswordInput = false,
    maxLength = 256,
    name,
    className = '',
    required = true,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <Form.Item
            className={className + ' !mb-2 w-full error-margin-bottom '}
            name={name}
            initialValue=""
            rules={[{
                required: !className.includes('hidden') && required,
                type: name === 'email' ? 'email' : undefined
            }]}
        >
            <div className="relative flex w-full items-center bg-bela-gray-3 rounded-md">
                {/* Left-side Icon */}
                <div className="flex items-center min-w-12 h-12 bg-bela-gray-2 rounded-md justify-center">
                    <div
                        className="w-6 aspect-1/1 bg-bela-third-2"
                        style={{
                            mask: `url(${iconUrl})`,
                        }}
                    />
                </div>

                {/* Input Field */}
                <input
                    type={isPasswordInput && !showPassword ? 'password' : 'text'}
                    placeholder={placeholder}
                    className={"w-full pl-4 py-2 focus:outline-none bg-bela-gray-3 placeholder-custom text-base font-normal " + (isPasswordInput ? 'pr-10' : 'pr-3')}
                    maxLength={maxLength}
                    autoComplete={isPasswordInput ? "current-password" : "username"}
                />

                {/* Right-side Icon for Password Input */}
                {isPasswordInput && (
                    <div
                        className="absolute right-0 flex items-center pr-5 cursor-pointer select-none"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeInvisibleTwoTone twoToneColor='#FF3F15' /> : <EyeTwoTone twoToneColor='#FF3F15' />}
                    </div>
                )}
            </div>
        </Form.Item>
    );
};

export default LoginInput;
