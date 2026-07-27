'use client';
import React, { Suspense, useEffect, useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import { Button, Divider, Layout, theme } from 'antd';
import Image from 'next/image';
import "@/styles/search.scss";
import LeftSideBar from '@/components/admin/organisms/LeftSideBar';
import '@/styles/components/antd-reset.scss';
import NavBarUserSection from '@/components/general/organisms/NavBarUserSection';
import ClearCacheBtn from '@/components/general/atoms/ClearCacheBtn';

const { Header, Sider, Content } = Layout;

function AdminLayout(
  { children }: {
    children: React.ReactNode;
  }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.documentElement.style.setProperty('--admin-sidebar-width', collapsed ? '80px' : '200px');
  }, [collapsed]);

  return (
    <>
      <Layout
        style={{
          minHeight: '100vh',
          ['--admin-sidebar-width' as any]: collapsed ? '80px' : '200px',
        }}
      >
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className='sticky top-0'>
            <div className='flex flex-row justify-center pt-2'>
              <Image
                src="/assets/images/logo/belayoga-logo-web.png"
                alt="belayoga-logo"
                width={0}
                height={0}
                sizes='100vw'
                priority={true}
                style={{ width: "180px", height: "auto" }}
              />
            </div>
            <Divider className='!mt-2.5 !mb-1 bg-slate-600' />
            <Suspense>
              <LeftSideBar />
            </Suspense>
          </div>
        </Sider>

        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
            className='flex items-center justify-between !pr-6 !h-14'
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Suspense>
              <div className='flex items-center'>
                <ClearCacheBtn />
                <NavBarUserSection fromAdmin={true} />
              </div>
            </Suspense>
          </Header>
          <Content
            style={{
              margin: '8px',
              padding: 8,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AdminLayout