
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, message, Modal, Skeleton } from 'antd';
import { checkToken, getUserInfo, removeTokens } from '@/utils/authenticate';
import Avatar from '@/components/general/molecules/Avartar';
import { LogoutOutlined } from '@ant-design/icons';
import { useLogoutMutation } from '@/services/api/users';
import { ADMIN_ROLE_NAME } from '@/constants/user';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/guest/Loading';
import { ADMIN_LOGIN } from '@/constants/route';
import useIsLogin from '@/hooks/useIsLogin';
import dynamic from 'next/dynamic';
import LoginRegisterForm from './LoginRegisterForm';
import UpdateUserInfoForm from './updateUserInfoForm';
import { getAdminPathFromPermissions } from '../../../utils/adminNavigation';

/** Import Lazy CSS */
const DropdownMenuCss = dynamic(() => import('@/components/non-critical/DropdownMenuCss'), { ssr: false });
/** End */

type NavBarUserSectionParams = {
  fromAdmin?: boolean;
  isMobile?: boolean;
}

const NavBarUserSection: React.FC<NavBarUserSectionParams> = ({ fromAdmin, isMobile }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalType, setModalType] = useState('');
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const accessToken = useRef('');
  const userInfo = getUserInfo();

  const [logout] = useLogoutMutation();
  const router = useRouter();

  const [isLogin, setIsLogin] = useIsLogin();

  const verifyAuth = async () => {
    const { access_token, isAuth: authStatus } = await checkToken();
    setIsLogin(authStatus);
    accessToken.current = access_token;
    setChecking(false);
  };

  useEffect(() => {
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // useEffect(() => {
  //   if (!getAccessToken() && fromAdmin) {
  //     router.push(ADMIN_LOGIN);
  //   }
  // }, [fromAdmin, isLogin, router]);

  const handleLogout = () => {
    setLoading(true);
    logout(accessToken.current)
      .unwrap()
      .then((payload: any) => {
        if (payload?.success) { }
      })
      .catch((error: any) => {
        console.log(error?.data?.message);
      })
      .finally(() => {
        setLoading(false);
        removeTokens();
        if (fromAdmin) {
          router.push(ADMIN_LOGIN);
        } else {
          setIsLogin(false);
        }
      })
  }

  const adminUrl = getAdminPathFromPermissions(userInfo?.permissionCodes)
  const optionClassName = " flex flex-row items-center gap-3 py-0.5 text-base font-semibold text-sgt-secondary-1 ";
  const userOptions = [
    ...(userInfo?.role === ADMIN_ROLE_NAME
      ? [
        {
          key: 1,
          label: (
            <a href={fromAdmin ? '/' : adminUrl} target="_blank">
              <div className={optionClassName}>
                {fromAdmin ? 'Trang chủ' : 'Trang Admin'}
              </div>
            </a>
          ),
        },
      ]
      : []),
    ...(userInfo?.role === ADMIN_ROLE_NAME
      ? [
        {
          key: 2,
          label: (
            <div className={optionClassName} onClick={() => setOpenUpdateModal(true)}>
              Cập nhật
            </div>
          ),
        },
      ]
      : []),
    {
      key: 3,
      label: (
        <div
          className={optionClassName}
          onClick={handleLogout}
        >
          Đăng xuất
          <LogoutOutlined />
        </div>
      ),
    },
  ];

  if (isMobile && userInfo?.full_name) {
    userOptions.unshift({
      key: 4,
      label: (
        <div className="flex flex-row items-center gap-3 pt-0.5 font-semibold text-sgt-primary-1 text-base">
          {userInfo?.full_name}
        </div>
      ),
    });
  }

  const authOptions = [
    {
      key: 1,
      label: (
        <div className={optionClassName} onClick={() => setModalType('login')}>
          Đăng nhập
        </div>
      ),
    },
    {
      key: 2,
      label: (
        <div className={optionClassName} onClick={() => setModalType('register')}>
          Đăng ký
        </div>
      ),
    },
  ];

  if (checking) {
    return <div className='flex items-center'>
      <Skeleton.Avatar className='mr-2 h-[37px]' shape="circle" size={'large'} />
      {!isMobile &&
        <Skeleton.Input className='h-8' />
      }
    </div>
  }

  const getUpdateDrawerProps = () => {
    return {
      centered: true,
      cancelButtonProps: { className: "!hidden" },
      okButtonProps: { className: "!hidden" },
      closable: false,
      styles: {
        mask: {
          backgroundColor: '#A7A7A7',
          opacity: 0.7,
          zIndex: 999,
        },
        content: {
          borderRadius: 25,
          padding: '40px 58px',
          marginTop: 50,
        }
      },
      maskTransitionName: "",
      footer: null,
      width: 460,
      destroyOnHidden: true,
    };
  };

  return (
    <>
      {isClient && <DropdownMenuCss />}
      {isClient && <Loading isLoading={loading} />}
      {!isLogin ?
        <div className='flex justify-end items-center gap-2.5'>
          {!isMobile ? (
            <>
              <div onClick={() => setModalType('login')} className='flex flex-row gap-1.5 justify-center items-center px-4 py-2 border rounded-lg border-sgt-primary-1 cursor-pointer sgt-login-btn'>
                <FontAwesomeIcon className='text-sgt-primary-1' icon={faUser} />
                <p className='text-button text-sgt-neutral-1'>Đăng nhập</p>
              </div>
              <div onClick={() => setModalType('register')} className='flex flex-row gap-1.5 justify-center items-center px-4 py-2 border rounded-lg border-sgt-primary-1 cursor-pointer'>
                <p className='text-button text-sgt-neutral-1'>Đăng ký</p>
              </div>
            </>
          ) : (
            <Dropdown
              menu={{ items: authOptions }}
              overlayClassName='sgt_dropdown_menu sgt_dropdown_menu_navbar'
              className='cursor-pointer'
              overlayStyle={{ minWidth: 0 }}
              placement="bottomRight" >
              <div>
                <FontAwesomeIcon className='text-sgt-neutral-1' size='lg' icon={faUser} />
              </div>
            </Dropdown>
          )}
          {
            isClient &&
            <Modal
              open={!!modalType}
              onCancel={() => setModalType('')}
              {...getUpdateDrawerProps()}
            >
              <LoginRegisterForm
                closeModal={() => setModalType('')}
                afterLogin={verifyAuth}
                modalType={modalType}
                messageApi={messageApi}
              />
            </Modal>
          }
        </div>
        :
        <>
          <Dropdown
            menu={{ items: userOptions }}
            overlayClassName='sgt_dropdown_menu sgt_dropdown_menu_navbar'
            className='cursor-pointer'
            overlayStyle={{
              minWidth: 0,
            }}
            placement="bottomRight"
          >
            <div className='flex justify-end items-center gap-2.5 text-base text-sgt-secondary-1 font-semibold ml-5'>
              <Avatar src={userInfo?.avatar} className='!h-9 !w-9' />
              {!isMobile && (
                <button onClick={(e) => e.preventDefault()} className='flex flex-row gap-1 justify-center items-center py-2'>
                  {userInfo?.full_name}
                  <FontAwesomeIcon className='text-2xs text-sgt-neutral-1' icon={faChevronDown} />
                </button>
              )}
            </div>
          </Dropdown>

          {
            isClient &&
            <Modal
              open={openUpdateModal}
              onCancel={() => setOpenUpdateModal(false)}
              {...getUpdateDrawerProps()}
            >
              <UpdateUserInfoForm closeModal={() => setOpenUpdateModal(false)} />
            </Modal>
          }
        </>
      }
      {contextHolder}
    </>
  )
}

export default NavBarUserSection