import { Modal } from "@heroui/react";
import { useState } from "react";

import Overlay from "../overlay";

import CourseForm from "./ClassForm";

import { Class } from "@/types";

function ClassUpdateModal({
  refetch,
  clazz,
  setClass,
}: {
  refetch: () => unknown;
  clazz?: Class;
  setClass: (c?: Class) => unknown;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled={!!isLoading}
      isOpen={!!clazz}
      shouldCloseOnInteractOutside={() => !isLoading}
      variant="opaque"
      onOpenChange={() => setClass(undefined)}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Chỉnh sửa lớp học</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <CourseForm
              clazz={clazz}
              refetch={refetch}
              setLoading={setLoading}
              onClose={() => setClass(undefined)}
            />
          </Modal.Body>
          {isLoading && <Overlay />}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export default ClassUpdateModal;
