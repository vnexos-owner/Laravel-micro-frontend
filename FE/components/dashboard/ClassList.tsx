"use client";

import {
  Avatar,
  Button,
  Card,
  Label,
  Modal,
  Skeleton,
  Tabs,
  toast,
  Tooltip,
} from "@heroui/react";
import {
  ArrowRotateLeft,
  BookOpen,
  Eye,
  FolderOpen,
  Persons,
} from "@gravity-ui/icons";
import { useEffect, useState } from "react";

import Overlay from "../overlay";

import { useLazyGetUserClassesQuery } from "@/store/queries/account";
import { Class, Course, User } from "@/types";
import {
  useGetClassCoursesQuery,
  useGetClassStudentsQuery,
} from "@/store/queries/classes";

function ViewCourseTab({ clazz }: { clazz: Class | null }) {
  const {
    data: classCourses,
    isFetching: ccFetching,
    refetch: refetchCC,
  } = useGetClassCoursesQuery(clazz?.id ?? "", { skip: !clazz });

  return (
    <>
      <div className="flex justify-between items-center">
        <Label>Môn học</Label>
        <Tooltip closeDelay={0} delay={0}>
          <Button
            isIconOnly
            className="size-5"
            isPending={ccFetching}
            onPress={refetchCC}
          >
            <ArrowRotateLeft className="size-4" />
          </Button>
          <Tooltip.Content>Làm mới</Tooltip.Content>
        </Tooltip>
      </div>
      <div className="relative w-full bg-muted rounded-2xl mt-1.5 p-2 flex flex-col gap-1.5 min-h-[100px]">
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
        {ccFetching && <Overlay />}
      </div>
    </>
  );
}

function ViewStudentTab({ clazz }: { clazz: Class | null }) {
  const {
    data: classStudents,
    isFetching: csFetching,
    refetch: refetchCS,
  } = useGetClassStudentsQuery(clazz?.id ?? "", { skip: !clazz });

  return (
    <>
      <div className="flex justify-between items-center">
        <Label>Học sinh</Label>
        <Tooltip closeDelay={0} delay={0}>
          <Button
            isIconOnly
            className="size-5"
            isPending={csFetching}
            onPress={refetchCS}
          >
            <ArrowRotateLeft className="size-4" />
          </Button>
          <Tooltip.Content>Làm mới</Tooltip.Content>
        </Tooltip>
      </div>
      <div className="relative w-full bg-muted rounded-2xl mt-1.5 p-2 flex flex-col gap-1.5 min-h-[100px]">
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
        {csFetching && <Overlay />}
      </div>
    </>
  );
}

interface ViewClassProps {
  clazz: Class | null;
  setClass: (v: Class | null) => unknown;
}
function ViewClass({ clazz, setClass }: ViewClassProps) {
  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled={!!false}
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
            <Label>Giáo viên chủ nhiệm</Label>
            <div className="bg-gray-300 dark:bg-gray-600 p-2 w-full rounded-lg mb-5">
              {!!clazz && (
                <div className="flex items-center gap-3">
                  <Avatar className="unselectable" size="sm">
                    <Avatar.Image src={clazz.homeroom_teacher.avatar ?? ""} />
                    <Avatar.Fallback>
                      {((n) =>
                        n.length > 1 ? n[0][0] + n.slice(-1)[0][0] : n[0][0])(
                        clazz.homeroom_teacher.name.trim().split(/\s+/) ?? "",
                      ).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Label className="text-xs">
                      {clazz.homeroom_teacher.name}
                    </Label>
                    <span className="text-xs text-muted">
                      {clazz.homeroom_teacher.username}
                    </span>
                  </div>
                </div>
              )}
            </div>
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
                <ViewCourseTab clazz={clazz} />
              </Tabs.Panel>
              <Tabs.Panel className="pt-4" id="student">
                <ViewStudentTab clazz={clazz} />
              </Tabs.Panel>
            </Tabs>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function ClassList() {
  const [fetchClasses, { isFetching }] = useLazyGetUserClassesQuery();

  const [viewingClass, setViewingClass] = useState<Class | null>(null);
  const [data, setData] = useState<Class[]>([]);

  useEffect(() => {
    fetchClasses(null, false)
      .unwrap()
      .then((val: Class[]) => setData(val))
      .catch(() =>
        toast.danger("Có lỗi xảy ra khi lấy danh sách lớp! Vui lòng thử lại."),
      );
  }, [setData]);

  return (
    <>
      <ViewClass clazz={viewingClass} setClass={setViewingClass} />
      {isFetching ? (
        <Skeleton className="w-100 h-20 rounded-2xl mt-5" />
      ) : data?.length ? (
        <div className="w-full grid grid-cols-4">
          {data?.map((clazz: Class) => (
            <Card key={clazz.id} className="m-5">
              <Card.Header className="inline text-2xl">
                {clazz?.name}
              </Card.Header>
              <Card.Content className="inline">
                <span className="font-bold">Học kỳ:</span>{" "}
                {clazz?.semester?.name}
              </Card.Content>
              <Card.Footer className="flex justify-end">
                <Tooltip closeDelay={0} delay={0}>
                  <Button isIconOnly onPress={() => setViewingClass(clazz)}>
                    <Eye />
                  </Button>
                  <Tooltip.Content>Xem chi tiết</Tooltip.Content>
                </Tooltip>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-muted">
          <FolderOpen className="size-15" />
          <p>Bạn chưa có lớp học nào</p>
        </div>
      )}
    </>
  );
}

export default ClassList;
