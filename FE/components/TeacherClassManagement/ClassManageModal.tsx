import {
  Button,
  Form,
  Key,
  Modal,
  Tabs,
  Autocomplete,
  Label,
  SearchField,
  ListBox,
  ProgressCircle,
  Tooltip,
  toast,
  Avatar,
  Description,
} from "@heroui/react";
import { useCallback, useState } from "react";
import {
  ArrowRotateLeft,
  BookOpen,
  CirclePlusFill,
  Persons,
} from "@gravity-ui/icons";

import CustomEmptyState from "../EmptyState";

import { Class, Course, User } from "@/types";
import { useGetCoursesQuery } from "@/store/queries/course";
import {
  useCreateClassCourseMutation,
  useCreateClassStudentMutation,
  useGetClassCoursesQuery,
  useGetClassStudentsQuery,
} from "@/store/queries/classes";
import { useGetUsersQuery } from "@/store/queries/account";

function ClassStudentTab({
  id,
  homeroom_teacher_id,
}: {
  id: string;
  homeroom_teacher_id: string;
}) {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);

  const [addStudent, { isLoading: isCreatingCS }] =
    useCreateClassStudentMutation();

  const {
    data: students,
    isFetching,
    refetch: refetchStudent,
  } = useGetUsersQuery({});
  const {
    data: classStudents,
    isFetching: csFetching,
    refetch: refetchCS,
  } = useGetClassStudentsQuery(id);

  const classStudentDisabled = (id: string) =>
    !!(classStudents as User[])?.find(
      (val) => val.id === id || id === homeroom_teacher_id,
    );

  const customFilter = (textValue: string, inputValue: string) => {
    const student = students.find((v: User) => v.name === textValue) as User;

    return (
      student?.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      student?.username.toLowerCase().includes(inputValue.toLowerCase()) ||
      student?.email.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const generateFallback = (name: string) =>
    ((n) => (n.length > 1 ? n[0][0] + n.slice(-1)[0][0] : n[0][0]))(
      name.trim().split(/\s+/),
    ).toUpperCase();

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        const body = {
          id,
          student_id: selectedKey!.toString(),
        };

        await addStudent(body).unwrap();

        toast.success("Thêm học sinh vào lớp thành công!");
        setSelectedKey(null);
        refetchCS();
      } catch {
        toast.danger("Có lỗi xảy ra trong quá trình thêm học sinh vào lớp.");
      }
    },
    [selectedKey],
  );

  return (
    <div className="flex flex-col max-w-full overflow-y-auto">
      <Modal>
        <Button className="w-full" isDisabled={isCreatingCS} type="button">
          <CirclePlusFill />
          Thêm học sinh
        </Button>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Thêm học sinh</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <Form className="p-2" onSubmit={handleSubmit}>
                  <div className="w-full h-fit flex gap-2 items-end">
                    <Autocomplete
                      allowsEmptyCollection
                      isRequired
                      aria-label="Học sinh"
                      className="w-full"
                      placeholder="Chọn học sinh"
                      selectionMode="single"
                      value={selectedKey}
                      onChange={setSelectedKey}
                    >
                      <Label>Học sinh</Label>
                      <Autocomplete.Trigger>
                        <Autocomplete.Value>
                          {({ defaultChildren, isPlaceholder, state }) => {
                            if (
                              isPlaceholder ||
                              state.selectedItems.length === 0
                            ) {
                              return defaultChildren;
                            }
                            const selectedItems = state.selectedItems;

                            if (selectedItems.length > 1) {
                              return `${selectedItems.length} users selected`;
                            }
                            const selectedItem = students.find(
                              (user: User) => user.id === selectedItems[0]?.key,
                            );

                            if (!selectedItem) {
                              return defaultChildren;
                            }

                            return (
                              <div className="flex items-center gap-2">
                                <Avatar className="size-4" size="sm">
                                  <Avatar.Image
                                    src={selectedItem.avatarUrl ?? ""}
                                  />
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
                        <Autocomplete.Filter filter={customFilter}>
                          <SearchField
                            aria-label="search user field"
                            name="search"
                            variant="secondary"
                          >
                            <SearchField.Group>
                              <SearchField.SearchIcon />
                              <SearchField.Input placeholder="Tìm kiếm học sinh..." />
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
                            {students?.map((user: User) => (
                              <ListBox.Item
                                key={user.id}
                                id={user.id}
                                isDisabled={classStudentDisabled(user.id)}
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

                    <div>
                      <Tooltip closeDelay={0} delay={0}>
                        <Button
                          isIconOnly
                          className="bg-success-soft text-success-soft-foreground"
                          isDisabled={isFetching}
                          onPress={() => refetchStudent()}
                        >
                          <ArrowRotateLeft />
                        </Button>
                        <Tooltip.Content className="bg-success-soft text-success-soft-foreground">
                          Làm mới
                        </Tooltip.Content>
                      </Tooltip>
                    </div>
                  </div>

                  <Button
                    className="w-full uppercase mt-3"
                    slot="close"
                    type="submit"
                  >
                    Thêm học sinh
                  </Button>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      {/* Show overlay when creating or fetching */}
      <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-2xl mt-1.5 p-2 flex flex-col gap-1.5 min-h-[100px]">
        {csFetching || isCreatingCS ? (
          <div className="flex flex-col justify-center items-center my-10">
            <ProgressCircle isIndeterminate aria-label="Loading" size="lg">
              <ProgressCircle.Track>
                <ProgressCircle.TrackCircle />
                <ProgressCircle.FillCircle />
              </ProgressCircle.Track>
            </ProgressCircle>
          </div>
        ) : (
          <>
            {classStudents?.map((u: User) => (
              <div
                key={u.id}
                className="bg-white dark:bg-slate-950 p-2 w-full rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="unselectable" size="sm">
                    <Avatar.Image src={u.avatar ?? ""} />
                    <Avatar.Fallback>
                      {((n) =>
                        n.length > 1 ? n[0][0] + n.slice(-1)[0][0] : n[0][0])(
                        u.name.trim().split(/\s+/),
                      ).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Label className="text-xs">{u.name}</Label>
                    <span className="text-xs text-muted">{u.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ClassSubjectTab({ id }: { id: string }) {
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);

  const [addCourse, { isLoading: isCreatingCC }] =
    useCreateClassCourseMutation();

  const {
    data: courses,
    isFetching,
    refetch: refetchCourse,
  } = useGetCoursesQuery({});
  const {
    data: classCourses,
    isFetching: ccFetching,
    refetch: refetchCC,
  } = useGetClassCoursesQuery(id);

  const classCourseDisabled = (id: string) =>
    !!(classCourses as Course[])?.find((val) => val.id === id);

  const customFilter = (textValue: string, inputValue: string) => {
    const course = courses.find((v: Course) => v.id === textValue) as Course;

    return (
      course?.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      course?.code?.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        await addCourse({ id, course_id: selectedKey!.toString() }).unwrap();

        toast.success("Thêm môn học vào lớp thành công!");
        setSelectedKey(null);
        refetchCC();
      } catch {
        toast.danger("Có lỗi xảy ra trong quá trình thêm môn học vào lớp.");
      }
    },
    [selectedKey],
  );

  return (
    <div className="flex flex-col max-w-full overflow-y-auto">
      <Modal>
        <Button className="w-full" isDisabled={isCreatingCC} type="button">
          <CirclePlusFill />
          Thêm môn học
        </Button>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Thêm môn học</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <Form className="p-2" onSubmit={handleSubmit}>
                  <div className="w-full h-fit flex gap-2 items-end">
                    <Autocomplete
                      allowsEmptyCollection
                      isRequired
                      aria-label="Môn học"
                      className="w-full"
                      placeholder="Chọn một môn học"
                      selectionMode="single"
                      value={selectedKey}
                      onChange={setSelectedKey}
                    >
                      <Label>Môn học</Label>
                      <Autocomplete.Trigger
                        style={
                          {
                            anchorName: "--autocomplete-subject-trigger",
                          } as React.CSSProperties
                        }
                      >
                        <Autocomplete.Value />
                        <Autocomplete.ClearButton />
                        <Autocomplete.Indicator />
                      </Autocomplete.Trigger>
                      <Autocomplete.Popover
                        className="rounded-md"
                        style={
                          {
                            width:
                              "anchor-size(--autocomplete-subject-trigger width)",
                            positionAnchor: "--autocomplete-subject-trigger",
                          } as React.CSSProperties
                        }
                      >
                        <Autocomplete.Filter filter={customFilter}>
                          <SearchField
                            aria-label="môn học"
                            name="search"
                            variant="secondary"
                          >
                            <SearchField.Group>
                              <SearchField.SearchIcon />
                              <SearchField.Input placeholder="Tìm kiếm môn học..." />
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
                            {courses?.map((course: Course) => (
                              <ListBox.Item
                                key={course.id}
                                className="text-wrap"
                                id={course.id}
                                isDisabled={classCourseDisabled(course.id)}
                                textValue={course.id}
                              >
                                {`${course.code} - ${course.name}`}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Autocomplete.Filter>
                      </Autocomplete.Popover>
                    </Autocomplete>

                    <div>
                      <Tooltip closeDelay={0} delay={0}>
                        <Button
                          isIconOnly
                          className="bg-success-soft text-success-soft-foreground"
                          isDisabled={isFetching}
                          onPress={() => refetchCourse()}
                        >
                          <ArrowRotateLeft />
                        </Button>
                        <Tooltip.Content className="bg-success-soft text-success-soft-foreground">
                          Làm mới
                        </Tooltip.Content>
                      </Tooltip>
                    </div>
                  </div>

                  <Button
                    className="w-full uppercase mt-3"
                    slot="close"
                    type="submit"
                  >
                    Thêm môn học
                  </Button>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      {/* Show overlay when creating or fetching */}
      <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-2xl mt-1.5 p-2 flex flex-col gap-1.5 min-h-[100px]">
        {ccFetching || isCreatingCC ? (
          <div className="flex flex-col justify-center items-center my-10">
            <ProgressCircle isIndeterminate aria-label="Loading" size="lg">
              <ProgressCircle.Track>
                <ProgressCircle.TrackCircle />
                <ProgressCircle.FillCircle />
              </ProgressCircle.Track>
            </ProgressCircle>
          </div>
        ) : (
          <>
            {classCourses?.map((v: Course) => (
              <div
                key={v.id}
                className="bg-white dark:bg-slate-950 p-2 w-full rounded-lg"
              >
                <div>
                  <strong>Mã môn học:</strong> {v.code}
                </div>
                <div>
                  <strong>Tên môn học:</strong> {v.name}
                </div>
                <div>
                  <strong>Môn tiên quyết:</strong> {v.prerequisite}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

interface ClassManageModalProps {
  clazz: Class | null;
  setClass: (v: Class | null) => unknown;
}
function ClassManageModal({ clazz, setClass }: ClassManageModalProps) {
  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled={!false}
      isOpen={!!clazz}
      shouldCloseOnInteractOutside={() => !false}
      variant="opaque"
      onOpenChange={() => setClass(null)}
    >
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Quản lý lớp học</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="max-h-[50vh]">
            <Tabs className="w-full max-w-md">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab className="flex gap-1.5" id="subject">
                    <BookOpen />
                    <span>Môn học</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab className="flex gap-1.5" id="student">
                    <Persons />
                    <span>Học sinh</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel className="pt-4" id="subject">
                {clazz?.id && <ClassSubjectTab id={clazz?.id} />}
              </Tabs.Panel>
              <Tabs.Panel className="pt-4" id="student">
                {clazz?.id && (
                  <ClassStudentTab
                    homeroom_teacher_id={clazz?.homeroom_teacher_id}
                    id={clazz?.id}
                  />
                )}
              </Tabs.Panel>
            </Tabs>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export default ClassManageModal;
