import React from 'react';
import { Modal } from 'antd';

export default function CustomModal({ children, title, close, ...props }) {
  return (
    <Modal
      {...props}
      footer={null}
      centered
      onCancel={close}
      // title={title}
      width={900}
    >
      {children}
    </Modal>
  );
}
