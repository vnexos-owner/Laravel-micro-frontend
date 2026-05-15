import { useCallback, useEffect, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

import Overlay from "../../overlay";

import {
  CourseCreateInfo,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/store/queries/course";
import { Course } from "@/types";
function CourseForm({
  onClose,
  setLoading,
  refetch,
  course,
}: {
  onClose: () => unknown;
  setLoading: (value: boolean) => unknown;
  refetch: () => unknown;
  course?: Course;
}) {
  const isEdit = course !== undefined;

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const isLoading = isCreating || isUpdating;

  const [errors, setErrors] = useState<any>({});
  const [data, setData] = useState<any>({
    code: course?.code ?? "",
    name: course?.name ?? "",
    prerequisite: course?.prerequisite ?? "",
  });

  const handleFieldChange = useCallback(
    (field: string) => (e: any) => setData({ ...data, [field]: e }),
    [data, setData],
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const body = data;

      try {
        if (isEdit) {
          const result: Course = await updateCourse({
            id: course.id,
            body: body as any,
          }).unwrap();

          toast(`Cập nhật thành công môn học ${result.code}!`, {
            variant: "success",
          });
        } else {
          const result: Course = await createCourse(
            body as CourseCreateInfo,
          ).unwrap();

          toast(`Tạo thành công môn học ${result.code}!`, {
            variant: "success",
          });
        }

        onClose();
        refetch();
      } catch (err: any) {
        const res = err.data.errors;
        let errData: any = {};

        Object.keys(res).forEach((v) => (errData[v] = res[v][0]));
        setErrors(errData);
        toast.danger(
          `Có lỗi xảy ra trong quá trình ${isEdit ? "cập nhật" : "tạo"} môn học!`,
        );
      }
    },
    [errors, setErrors, isEdit, course, data],
  );

  return (
    <>
      <Form
        className="w-full flex flex-col gap-4 px-5 mt-7"
        validationErrors={errors}
        onSubmit={onSubmit}
      >
        <TextField
          isRequired
          isDisabled={isLoading}
          name="code"
          type="text"
          value={data["code"]}
          onChange={handleFieldChange("code")}
        >
          <Label>Mã</Label>
          <Input placeholder="Mã môn học" />
          <FieldError />
        </TextField>
        <TextField
          isRequired
          isDisabled={isLoading}
          name="name"
          type="text"
          value={data["name"]}
          onChange={handleFieldChange("name")}
        >
          <Label>Tên</Label>
          <Input placeholder="Tên môn học" />
          <FieldError />
        </TextField>
        <TextField
          isDisabled={isLoading}
          name="prerequisite"
          type="text"
          value={data["prerequisite"]}
          onChange={handleFieldChange("prerequisite")}
        >
          <Label>Môn tiên quyết</Label>
          <Input placeholder="Môn học tiên quyết" />
          <FieldError />
        </TextField>

        <Button
          className="w-full uppercase mb-1"
          isDisabled={isLoading}
          type="submit"
        >
          {isEdit ? "Cập nhật" : "Tạo"}
        </Button>
      </Form>
      {isLoading && <Overlay />}
    </>
  );
}

export default CourseForm;
