import { TriangleExclamationFill } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import { ReactNode } from "react";

import Overlay from "./overlay";

function ConfirmationModal({
  isOpen,
  setIsOpen,
  onConfirm,
  isLoading,
  title = "Xác nhận tiếp tục",
  message = (
    <p>
      Hành động này có khả năng sẽ không thể hoàn tác. Bạn có muốn tiếp tục?
    </p>
  ),
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => unknown;
  onConfirm: (v: boolean) => unknown;
  title?: ReactNode | string;
  message?: ReactNode | string;
  isLoading: boolean;
}) {
  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled={!!isLoading}
      isOpen={isOpen}
      shouldCloseOnInteractOutside={() => !isLoading}
      onOpenChange={(e) => {
        if (!e) onConfirm(false);
        setIsOpen(e);
      }}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-warning-soft text-warning-soft-foreground">
              <TriangleExclamationFill className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button
              slot="close"
              variant="secondary"
              onClick={() => onConfirm(false)}
            >
              Không
            </Button>
            <Button onClick={() => onConfirm(true)}>Có</Button>
          </Modal.Footer>
          {isLoading && <Overlay />}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export default ConfirmationModal;
