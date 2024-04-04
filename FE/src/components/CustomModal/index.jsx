import useModal from "@hooks/useModal";
import { Button, Drawer, Modal } from "antd";
import React, { useCallback } from "react";
import { useImperativeHandle } from "react";
const CustomModal = (
  {
    button,
    children,
    title,
    placement = "right",
    noButton = false,
    width = 400,
    footer,
    destroyOnClose = true,
    onOk,
    onClose,
    isRealModal = false,
  },
  ref
) => {
  const {
    close: closeOnly,
    open,
    toggle,
    isOpen,
  } = useModal({ initialOpen: false });
  const close = useCallback(() => {
    closeOnly();
    onClose?.();
  }, [closeOnly, onClose]);

  useImperativeHandle(
    ref,
    () => {
      return { close, open, toggle };
    },
    [close, open, toggle]
  );
  return (
    <>
      {!noButton && (
        <>
          {button?.({ open, toggle }) || (
            <Button onClick={open} type="primary">
              Open
            </Button>
          )}
        </>
      )}

      {isRealModal ? (
        <Modal
          onCancel={() => {
            close();
            onClose?.();
          }}
          footer={footer}
          width={width}
          maskClosable={true}
          destroyOnClose={destroyOnClose}
          closable={true}
          onOk={onOk || close}
          title={title || "Tiêu đề"}
          // onClose={close}
          // onCancel={close}
          open={isOpen}
        >
          {children?.({ open, close }) || children}
        </Modal>
      ) : (
        <Drawer
          width={width}
          destroyOnClose={true}
          closable={true}
          title={title || "Tiêu đề"}
          placement={placement}
          onClose={() => {
            close();
            onClose?.();
          }}
          open={isOpen}
        >
          {children?.({ open, close }) || children}
        </Drawer>
      )}
    </>
  );
};

export default React.forwardRef(CustomModal);
