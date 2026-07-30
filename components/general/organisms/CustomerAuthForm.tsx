'use client';

import React from 'react';
import LoginRegisterForm from './LoginRegisterForm';

type Props = {
  closeModal?: any;
  afterLogin?: any;
  modalType: string;
  messageApi?: any;
};

const CustomerAuthForm: React.FC<Props> = ({ closeModal, afterLogin, modalType, messageApi }) => {
  return (
    <LoginRegisterForm
      closeModal={closeModal}
      afterLogin={afterLogin}
      fromAdmin={false}
      modalType={modalType}
      messageApi={messageApi}
    />
  );
};

export default CustomerAuthForm;
