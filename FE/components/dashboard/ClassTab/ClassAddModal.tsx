"use client";

import { Button, Modal } from "@heroui/react";
import { useState } from "react";
import { CirclePlusFill } from "@gravity-ui/icons";

import ClassForm from "./ClassForm";

function CourseAddModal({ refetch }: { refetch: () => unknown }) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Modal>
      <Button variant="primary" onClick={() => setOpen(!isOpen)}>
        <CirclePlusFill />
        Thêm lớp học
      </Button>
      <Modal.Backdrop
        isKeyboardDismissDisabled={!!isLoading}
        isOpen={isOpen}
        shouldCloseOnInteractOutside={() => !isLoading}
        variant="opaque"
        onOpenChange={setOpen}
      >
        <Modal.Container size="lg">
          <Modal.Dialog className="sm:max-w-[400px]">
            <Modal.CloseTrigger />
            <Modal.Header className="flex">
              <Modal.Heading>Thêm lớp học</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <ClassForm
                refetch={refetch}
                setLoading={setIsLoading}
                onClose={() => setOpen(false)}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default CourseAddModal;
