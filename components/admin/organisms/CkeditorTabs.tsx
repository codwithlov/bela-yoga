'use client';

import React from 'react';
import { Form, Tabs } from 'antd';
import dynamic from 'next/dynamic';
import { commonCkeditorTabFields } from '@/constants/ui';
import { PostHistory } from '@/interfaces/post';

const CustomEditor = dynamic(() => import('@/components/admin/atoms/CustomEditor'), { ssr: false });

type CkeditorTabsProps = {
  getFormValue?: any;
  fields?: Array<{ key: string; label: string }>;
  selectedKey?: any;
  stickyTab?: boolean;
  articleMenu?: any;
  histories?: PostHistory[];
};

const CkeditorTabs: React.FC<CkeditorTabsProps> = ({
  getFormValue = () => '',
  fields = commonCkeditorTabFields,
  selectedKey = '',
  stickyTab,
  articleMenu,
  histories,
}) => {
  const tabItems = fields.map(({ key, label }) => ({
    key,
    label,
    children: (
      <div className={'flex flex-1 justify-center bg-bela-bg-primary mb-2 -mt-4' + (stickyTab ? ' pt-4' : '')}>
        {articleMenu && articleMenu}
        <Form.Item name={key + selectedKey} className={(stickyTab ? 'ck-top-64' : '') + " w-[800px] !my-2 "}>
          <CustomEditor
            key={key + selectedKey}
            data={getFormValue(key, selectedKey) || ''}
            histories={histories}
            type={key}
          />
        </Form.Item>
      </div>
    ),
  }));

  return (
    <Tabs items={tabItems} centered className={stickyTab ? 'stick-tabs' : ''} />
  );
};

export default CkeditorTabs;
