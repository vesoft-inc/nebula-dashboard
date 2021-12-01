import { Modal as AntModal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { useEffect, useState } from 'react';

interface IModalHandler {
  show: (callback?: any) => void;
  hide: (callback?: any) => void;
}

interface IProps extends ModalProps {
  /**
   * use this hook you can get the handler of Modal
   * handlerRef => ({ visible, show, hide })
   */
  handlerRef?: (handler: IModalHandler) => void;
  children?: any;
}
const Modal: React.FC<IProps> = (props: IProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (props.handlerRef) {
      props.handlerRef({
        show,
        hide,
      });
    }
  });

  const show = async (callback?: any) => {
    await setVisible(true);
    if (callback) {
      callback();
    }
  };

  const hide = async (callback?: any) => {
    await setVisible(false);
    if (callback) {
      callback();
    }
  };

  return (
    <>
      {visible && (
        <AntModal
          visible
          onCancel={() => {
            hide();
          }}
          {...props}
        >
          {props.children}
        </AntModal>
      )}
    </>
  );
};

export default Modal;
