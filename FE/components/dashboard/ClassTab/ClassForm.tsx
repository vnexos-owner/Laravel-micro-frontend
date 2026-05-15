import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Key,
  Label,
  ListBox,
  ProgressCircle,
  SearchField,
  TextField,
  toast,
  useFilter,
} from "@heroui/react";

import Overlay from "../../overlay";

import { Class, User } from "@/types";
import {
  ClassCreateBody,
  useCreateClassMutation,
  useUpdateClassMutation,
} from "@/store/queries/classes";
import {
  useGetCurrentSemesterQuery,
  useGetSemesterByIdQuery,
} from "@/store/queries/semester";
import { useGetUsersInRoleQuery } from "@/store/queries/account";
import CustomEmptyState from "@/components/EmptyState";
function ClassForm({
  onClose,
  setLoading,
  refetch,
  clazz,
}: {
  onClose: () => unknown;
  setLoading: (value: boolean) => unknown;
  refetch: () => unknown;
  clazz?: Class;
}) {
  const isEdit = clazz !== undefined;

  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const isLoading = isCreating || isUpdating;

  const { data: currentSemester } = useGetCurrentSemesterQuery(null, {
    skip: !!clazz,
  });

  const { data: oldSemester } = useGetSemesterByIdQuery(
    clazz?.semester_id ?? "-",
    {
      skip: !!!clazz,
    },
  );

  const { data: teachers, isFetching } = useGetUsersInRoleQuery("teacher");

  const [errors, setErrors] = useState<any>({});
  const [selectedKey, setSelectedKey] = useState<Key | null>(
    clazz?.homeroom_teacher_id ?? "",
  );
  const [data, setData] = useState<any>({
    name: clazz?.name ?? "",
    semester_id: clazz?.semester_id ?? "",
    homeroom_teacher_id: clazz?.homeroom_teacher_id ?? "",
  });
  const { contains } = useFilter({ sensitivity: "base" });

  const handleFieldChange = useCallback(
    (field: string) => (e: any) => setData({ ...data, [field]: e }),
    [data, setData],
  );

  const generateFallback = (name: string) =>
    ((n) => (n.length > 1 ? n[0][0] + n.slice(-1)[0][0] : n[0][0]))(
      name.trim().split(/\s+/),
    ).toUpperCase();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      homeroom_teacher_id: selectedKey?.toString(),
    }));
  }, [selectedKey, setData]);

  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      semester_id: (clazz ? oldSemester?.id : currentSemester?.id) ?? "",
    }));
  }, [oldSemester, currentSemester, clazz]);

  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const body = data;

      try {
        if (isEdit) {
          const result: Class = await updateClass({
            id: clazz.id,
            body: body as any,
          }).unwrap();

          toast(`Cập nhật thành công lớp học ${result.name}!`, {
            variant: "success",
          });
        } else {
          const result: Class = await createClass(
            body as ClassCreateBody,
          ).unwrap();

          toast(`Tạo thành công lớp học ${result.name}!`, {
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
          `Có lỗi xảy ra trong quá trình ${isEdit ? "cập nhật" : "tạo"} lớp học!`,
        );
      }
    },
    [errors, setErrors, isEdit, clazz, data],
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
          name="name"
          type="text"
          value={data["name"]}
          onChange={handleFieldChange("name")}
        >
          <Label>Tên lớp học</Label>
          <Input placeholder="Tên lớp học" />
          <FieldError />
        </TextField>

        <Autocomplete
          allowsEmptyCollection
          isRequired
          aria-label="Giáo viên chủ nhiệm"
          className="w-full"
          placeholder="Chọn giáo viên chủ nhiệm"
          selectionMode="single"
          value={selectedKey}
          onChange={setSelectedKey}
        >
          <Label>Giáo viên chủ nhiệm</Label>
          <Autocomplete.Trigger>
            <Autocomplete.Value>
              {({ defaultChildren, isPlaceholder, state }) => {
                if (isPlaceholder || state.selectedItems.length === 0) {
                  return defaultChildren;
                }
                const selectedItems = state.selectedItems;

                if (selectedItems.length > 1) {
                  return `${selectedItems.length} users selected`;
                }
                const selectedItem = teachers.find(
                  (user: User) => user.id === selectedItems[0]?.key,
                );

                if (!selectedItem) {
                  return defaultChildren;
                }

                return (
                  <div className="flex items-center gap-2">
                    <Avatar className="size-4" size="sm">
                      <Avatar.Image src={selectedItem.avatarUrl ?? ""} />
                      <Avatar.Fallback className="text-[9px]">
                        {generateFallback(selectedItem.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <span>{selectedItem.name}</span>
                  </div>
                );
              }}
            </Autocomplete.Value>
            <Autocomplete.ClearButton />
            <Autocomplete.Indicator />
          </Autocomplete.Trigger>
          <Autocomplete.Popover>
            <Autocomplete.Filter filter={contains}>
              <SearchField
                aria-label="search user field"
                name="search"
                variant="secondary"
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Tìm kiếm giáo viên chủ nhiệm..." />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              <ListBox
                renderEmptyState={() =>
                  isFetching ? (
                    <div className="flex flex-col justify-center">
                      <ProgressCircle
                        isIndeterminate
                        aria-label="Loading"
                        size="lg"
                      >
                        <ProgressCircle.Track>
                          <ProgressCircle.TrackCircle />
                          <ProgressCircle.FillCircle />
                        </ProgressCircle.Track>
                      </ProgressCircle>
                    </div>
                  ) : (
                    <CustomEmptyState />
                  )
                }
              >
                {teachers?.map((user: User) => (
                  <ListBox.Item
                    key={user.id}
                    id={user.id}
                    textValue={user.name}
                  >
                    <Avatar size="sm">
                      <Avatar.Image src={user.avatar ?? ""} />
                      <Avatar.Fallback>
                        {generateFallback(user.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Label>{user.name}</Label>
                      <Description>{user.username}</Description>
                    </div>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Autocomplete.Filter>
          </Autocomplete.Popover>
        </Autocomplete>
        <TextField
          isDisabled
          type="text"
          value={(clazz ? oldSemester?.name : currentSemester?.name) ?? ""}
        >
          <Label>Học kỳ</Label>
          <Input placeholder="Học kỳ" />
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

export default ClassForm;
