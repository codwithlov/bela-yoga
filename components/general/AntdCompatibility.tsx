'use client';

import { unstableSetRender } from 'antd';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

type AntdContainer = Element & {
  __antd_react_root__?: Root;
};

unstableSetRender((node, container) => {
  const target = container as AntdContainer;

  if (!target.__antd_react_root__) {
    target.__antd_react_root__ = createRoot(container);
  }

  target.__antd_react_root__.render(node);

  return async () => {
    await Promise.resolve();
    target.__antd_react_root__?.unmount();
    delete target.__antd_react_root__;
  };
});

export default function AntdCompatibility() {
  return null;
}
