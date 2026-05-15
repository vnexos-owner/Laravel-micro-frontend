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
import { parseDate } from "@internationalized/date";

import Overlay from "../../overlay";

import { Course, Semester } from "@/types";
import {
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
} from "@/store/queries/semester";
import DatePickerField from "@/components/datepicker-field";

function SemesterForm({
  onClose,
  setLoading,
  refetch,
  semester,
}: {
  onClose: () => unknown;
  setLoading: (value: boolean) => unknown;
  refetch: () => unknown;
  semester?: Semester;
}) {
  const isEdit = semester !== undefined;

  const [createSemester, { isLoading: isCreating }] =
    useCreateSemesterMutation();
  const [updateSemester, { isLoading: isUpdating }] =
    useUpdateSemesterMutation();
  const isLoading = isCreating || isUpdating;

  const [errors, setErrors] = useState<any>({});
  const [data, setData] = useState<any>({
    name: semester?.name ?? "",
    start_time: semester?.start_time
      ? parseDate(semester.start_time.slice(0, 10))
      : null,
    end_time: semester?.end_time
      ? parseDate(semester.end_time.slice(0, 10))
      : null,
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
          const result: Semester = await updateSemester({
            id: semester.id,
            body: {
              name: body.name,
              start_time: body.start_time?.toString(),
              end_time: body.end_time?.toString(),
            },
          }).unwrap();

          toast(`Cập nhật thành công học kỳ ${result.name}!`, {
            variant: "success",
          });
        } else {
          const result: Course = await createSemester({
            name: body.name,
            start_time: body.start_time?.toString(),
            end_time: body.end_time?.toString(),
          }).unwrap();

          toast(`Tạo thành công học kỳ ${result.code}!`, {
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
          `Có lỗi xảy ra trong quá trình ${isEdit ? "cập nhật" : "tạo"} học kỳ!`,
        );
      }
    },
    [errors, setErrors, isEdit, semester, data],
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
          value={data["name"]}
          onChange={handleFieldChange("name")}
        >
          <Label>Tên học kỳ</Label>
          <Input placeholder="Tên học kỳ" />
          <FieldError />
        </TextField>
        <DatePickerField
          isRequired
          isLoading={isLoading}
          label="Ngày bắt đầu"
          name="start_time"
          value={data["start_time"]}
          onChange={handleFieldChange("start_time")}
        />
        <DatePickerField
          isRequired
          isLoading={isLoading}
          label="Ngày kết thúc"
          name="end_time"
          value={data["end_time"]}
          onChange={handleFieldChange("end_time")}
        />

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

export default SemesterForm;
