import { Modal } from "@heroui/react";
import { useState } from "react";

import Overlay from "../../overlay";

import CourseForm from "./CourseForm";

import { Course } from "@/types";

function CourseUpdateModal({
  refetch,
  course,
  setCourse,
}: {
  refetch: () => unknown;
  course?: Course;
  setCourse: (c?: Course) => unknown;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled={!!isLoading}
      isOpen={!!course}
      shouldCloseOnInteractOutside={() => !isLoading}
      variant="opaque"
      onOpenChange={() => setCourse(undefined)}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Chỉnh sửa môn học</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <CourseForm
              course={course}
              refetch={refetch}
              setLoading={setLoading}
              onClose={() => setCourse(undefined)}
            />
          </Modal.Body>
          {isLoading && <Overlay />}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export default CourseUpdateModal;
