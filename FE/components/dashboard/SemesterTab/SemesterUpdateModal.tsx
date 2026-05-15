import { Modal } from "@heroui/react";
import { useState } from "react";

import Overlay from "../../overlay";

import SemesterForm from "./SemesterForm";

import { Semester } from "@/types";

function SemesterUpdateModal({
  refetch,
  semester,
  setSemester,
}: {
  refetch: () => unknown;
  semester?: Semester;
  setSemester: (c?: Semester) => unknown;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled={!!isLoading}
      isOpen={!!semester}
      shouldCloseOnInteractOutside={() => !isLoading}
      variant="opaque"
      onOpenChange={() => setSemester(undefined)}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Chỉnh sửa học kỳ</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <SemesterForm
              refetch={refetch}
              semester={semester}
              setLoading={setLoading}
              onClose={() => setSemester(undefined)}
            />
          </Modal.Body>
          {isLoading && <Overlay />}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export default SemesterUpdateModal;
