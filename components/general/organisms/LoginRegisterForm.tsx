'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { Form } from 'antd';
import LoginInput from '../atoms/LoginInput';
import { Loading } from '@/components/guest/Loading';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { validateMessages } from '@/utils/validateRule';
import { handleStoreCookies } from '@/utils/authenticate';
import { ADMIN_ROLE_NAME } from '@/constants/user';
import { usePostDataMutation } from '@/services/api/common';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { clickClassButton, handleApiResponse } from '@/utils/helper';
import PasswordInput from '../molecules/input/PasswordInput';
import EmailInput from '../molecules/input/EmailInput';
import SubmitButton from '../molecules/SubmitButton';
import EmailRequiredModal from './EmailRequiredModal';
import { useRouter } from 'next/navigation';
import { responseMessages } from '@/constants/ui';
import dynamic from 'next/dynamic';
import { getAdminPathFromPermissions } from '../../../utils/adminNavigation';



/** Import Lazy CSS */
const DividerCss = dynamic(() => import('@/components/non-critical/DividerCss'), { ssr: false });
/** End */

type Params = {
    closeModal?: any,
    afterLogin?: any,
    fromAdmin?: boolean,
    modalType: string,
    messageApi?: any,
}

type GoogleLoginButtonProps = {
    onSuccess: (credentialResponse: any, type: string) => Promise<void>;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
    const googleLogin = useGoogleLogin({
        onSuccess: (value) => onSuccess(value, 'google'),
        onError: () => {
            console.error('Login Failed');
        },
        flow: 'implicit',
    });

    return (
        <IconButton
            iconSrc="/assets/icons/google-icon.svg"
            text="Google"
            onClick={() => googleLogin()}
        />
    );
};

const IconButton = ({ iconSrc, text, onClick }: { iconSrc: string; text: string; onClick: any }) => (
    <button
        className='flex-1 py-2 border border-bela-gray-1 flex items-center justify-center rounded-md gap-2'
        onClick={onClick}
        type='button'
    >
        <Image
            src={iconSrc}
            alt={text}
            width={0}
            height={0}
            className='w-6 aspect-1/1'
        />
        <p className='text-sm '>{text}</p>
    </button>
);

const LoginRegisterForm: React.FC<Params> = ({ closeModal, afterLogin, fromAdmin, modalType, messageApi }) => {
    const router = useRouter();
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showforgetPassword, setShowForgetPassword] = useState(false);
    const [emailrequiredDrawer, setEmailRequiredDrawer] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [postApi] = usePostDataMutation();
    const googleClientId = process.env.NEXT_PUBLIC_CLIENT_ID?.trim();
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_ID?.trim();
    const hasSocialLogin = Boolean(googleClientId || facebookAppId);

    const socialAccessToken = useRef(null);

    useEffect(() => {
        setShowForgetPassword(false);
    }, [modalType]);

    const handleSocialLoginSuccess = async (credentialResponse: any, type: string) => {
        if (credentialResponse) {
            socialAccessToken.current = credentialResponse.access_token || credentialResponse.accessToken
            const postData = {
                url: 'social/login',
                data: { token: socialAccessToken.current, type },
            };

            await handleApiResponse(
                postApi(postData),
                (payload: any) => {
                    if (payload.message === 'email_required') {
                        setEmailRequiredDrawer(true);
                    } else {
                        successLogin(payload);
                    }
                },
                setLoading,
                messageApi,
            );
        }
    };

    const handleOnSubmit = async (data: any) => {
        if (showforgetPassword) {
            const postData = {
                url: 'user/forgotPassword',
                data: { email: data.email },
            };
            await handleApiResponse(
                postApi(postData),
                (payload: any) => {
                    messageApi.open({
                        type: 'success',
                        content: responseMessages[payload?.message],
                    });
                    closeModal();
                },
                setLoading,
                messageApi,
            );
        } else {
            const postData = {
                url: 'user/' + modalType,
                data: data,
            };
            await handleApiResponse(
                postApi(postData),
                (payload: any) => {
                    if (payload?.data?.user_info?.role !== ADMIN_ROLE_NAME && fromAdmin) {
                        showErrorToastr('email_or_password_not_correct');
                        return;
                    }
                    successLogin(payload);
                },
                setLoading,
                messageApi,
            );
        }
    }

    const onFinishUpdateEmail = async (data: any) => {
        const postData = {
            url: 'updateSocialEmail',
            data: {
                email: data.email,
                token: socialAccessToken.current,
            },
        };
        await handleApiResponse(
            postApi(postData),
            (payload: any) => {
                successLogin(payload);
            },
            setLoading,
            messageApi,
        );
    }

    const successLogin = (payload: any) => {
        if (!fromAdmin) {
            messageApi.open({
                type: 'success',
                content: responseMessages[payload?.message] || responseMessages.success,
            });
        }
        handleStoreCookies(payload?.data);
        if (closeModal) {
            closeModal();
        }
        if (afterLogin) {
            afterLogin();
        }
        if (fromAdmin) {
            const permissionCodes = payload?.data?.user_info?.permissionCodes || [];
            if (permissionCodes.length > 0) {
                showSuccessToastr('admin_success_login');
                router.push(getAdminPathFromPermissions(permissionCodes));
            } else {
                showErrorToastr('invalid_credential');
            }
        }
    }

    const isLoginRegister = !fromAdmin && !showforgetPassword;
    const isLogin = isLoginRegister && modalType === 'login';

    useEffect(() => {
        setIsClient(true);
    }, [])

    return (<>
        {isClient && <DividerCss />}
        {
            isClient &&
            <div className='flex flex-col items-center'>
                {loading && <Loading isLoading={loading} />}
                {isLoginRegister &&
                    <div className='p-1 absolute top-8 right-9 cursor-pointer hover:bg-bela-gray-2 rounded-md' onClick={closeModal}>
                        <div className='bg-bela-gray-1'
                            style={{
                                mask: 'url("/assets/icons/close.svg")',
                                maskSize: 'cover',
                                width: "1.5rem",
                                height: "1.5rem",
                            }}
                        >
                        </div>
                    </div>
                }
                <p className='text-3xl font-semibold leading-[none] text-center text-bela-primary-1 mb-4'>
                    {showforgetPassword ? 'Quên mật khẩu' : modalType === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </p>
                {isLogin &&
                    <>
                        <p className='text-sm font-medium leading-[1.3125rem] text-bela-neutral-4 text-center'>
                            Chào mừng bạn đến với SPORTVERSE
                            <br />
                            Đăng nhập để theo dõi lịch sân, bài đăng trận đấu
                            <br />
                            và cập nhật cộng đồng mới nhất.
                        </p>
                        {hasSocialLogin &&
                            <>
                                <div className='flex gap-4 mt-6 w-full'>
                                    {googleClientId && (
                                        <GoogleLoginButton onSuccess={handleSocialLoginSuccess} />
                                    )}
                                    {facebookAppId && (
                                        <IconButton
                                            iconSrc="/assets/icons/facebook-icon.svg"
                                            text="Facebook"
                                            onClick={() => clickClassButton('hidden-facebook-login')}
                                        />
                                    )}
                                </div>
                                {facebookAppId && (
                                    <FacebookLogin
                                        className='hidden hidden-facebook-login'
                                        appId={facebookAppId}
                                        onSuccess={(value) => handleSocialLoginSuccess(value, 'facebook')}
                                    />
                                )}

                                <div className='sgt_divider_with_text mt-4'>
                                    <p className='text-sm !font-normal !text-bela-gray-1'>Hoặc</p>
                                </div>
                            </>
                        }
                    </>
                }
                {
                    modalType === 'login' ?
                        <Form
                            form={loginForm}
                            className='!mt-4 flex flex-col w-full'
                            onFinish={handleOnSubmit}
                            validateMessages={validateMessages}
                        >
                            <EmailInput className={showforgetPassword ? '' : 'hidden'} />
                            <LoginInput
                                placeholder="Nhập email hoặc số điện thoại"
                                iconUrl="/assets/icons/phone.svg"
                                name='account'
                                className={showforgetPassword ? 'hidden' : ''}
                            />
                            <PasswordInput className={showforgetPassword ? 'hidden' : ''} />
                            {!fromAdmin &&
                                <div
                                    className='text-xs font-normal ml-auto mr-2 text-bela-primary-1 cursor-pointer hover:text-bela-primary-2 select-none'
                                    onClick={() => setShowForgetPassword(!showforgetPassword)}
                                >
                                    {showforgetPassword ? 'Đăng nhập' : 'Quên mật khẩu'}
                                </div>
                            }
                            <SubmitButton text={showforgetPassword ? 'Gửi link đổi mật khẩu' : 'Đăng nhập'} />
                        </Form>
                        :
                        <Form
                            form={registerForm}
                            className='!mt-4 flex flex-col w-full'
                            onFinish={handleOnSubmit}
                            validateMessages={validateMessages}
                        >
                            <EmailInput />
                            <LoginInput
                                placeholder="Nhập số điện thoại"
                                iconUrl="/assets/icons/phone.svg"
                                maxLength={12}
                                name='phone'
                                required={false}
                            />
                            <LoginInput
                                placeholder="Họ và tên"
                                iconUrl="/assets/icons/user.svg"
                                name='full_name'
                            />
                            <PasswordInput />
                            <PasswordInput confirm placeholder="Xác nhận mật khẩu" />

                            <SubmitButton text='Đăng ký' />
                        </Form>
                }
                <EmailRequiredModal
                    emailrequiredDrawer={emailrequiredDrawer}
                    setEmailRequiredDrawer={setEmailRequiredDrawer}
                    onFinish={onFinishUpdateEmail}
                />
            </div>
        }

    </>);
}

export default LoginRegisterForm;
