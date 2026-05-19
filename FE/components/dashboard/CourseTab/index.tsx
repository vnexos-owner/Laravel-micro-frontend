import {
  Autocomplete,
  Button,
  Chip,
  Pagination,
  Table,
  ListBox,
  toast,
  InputGroup,
  Switch,
  Label,
  Separator,
  Tooltip,
} from "@heroui/react";
import { useRef, useState } from "react";
import { ArrowUturnCwLeft, PencilToLine, TrashBin } from "@gravity-ui/icons";

import Overlay from "../../overlay";
import ConfirmationModal from "../../confirmation-modal";
import { SearchIcon } from "../../icons";

import CourseAddModal from "./CourseAddModal";
import CourseUpdateModal from "./CourseUpdateModal";

import { Course } from "@/types";
import { PAGE_LIMIT_CHOICES } from "@/config";
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useRestoreCourseMutation,
} from "@/store/queries/course";
import CustomEmptyState from "@/components/EmptyState";

const ROWS_PER_PAGE = 5;

const columns = [
  { id: "code", name: "Mã môn học" },
  { id: "name", name: "Tên môn học" },
  { id: "role", name: "Môn học tiên quyết" },
  { id: "status", name: "Trạng thái" },
  { id: "action", name: "Hành động" },
];

function CourseTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(ROWS_PER_PAGE);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const {
    data: coursesResponse,
    isFetching: isLoading,
    refetch,
  } = useGetCoursesQuery({ page, search, includeDeleted, limit });

  const courses: Course[] = coursesResponse?.data ?? [];
  const totalPages = coursesResponse?.last_page ?? 1;
  const total = coursesResponse?.total ?? 0;
  const from = coursesResponse?.from ?? 0;
  const to = coursesResponse?.to ?? 0;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const actionRef = useRef<() => unknown>(() => {});
  const [updatingCourse, setUpdatingCourse] = useState<Course | undefined>();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [restoreCourse, { isLoading: isRestoring }] =
    useRestoreCourseMutation();

  const handleConfirm = (v: boolean) => {
    if (v) actionRef.current();
  };

  const handleDeleteCourse = async (id: string, code: string) => {
    try {
      await deleteCourse(id).unwrap();
      refetch();
      toast.success(`Xóa thành công môn học ${code}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi xóa môn học.");
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  const handleRestoreCourse = async (id: string, code: string) => {
    try {
      await restoreCourse(id).unwrap();
      refetch();
      toast.success(`Khôi phục thành công môn học ${code}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi khôi phục môn học.");
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        isLoading={isDeleting || isRestoring}
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        onConfirm={handleConfirm}
      />
      <CourseUpdateModal
        course={updatingCourse}
        refetch={refetch}
        setCourse={setUpdatingCourse}
      />
      <div
        className="w-full flex flex-wrap justify-between mb-1.5"
        id="controller"
      >
        <div className="flex flex-wrap gap-2">
          <InputGroup variant="secondary">
            <InputGroup.Input
              className="w-[250px]"
              placeholder="Tìm kiếm..."
              onInput={(e: any) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <InputGroup.Suffix>
              <SearchIcon />
            </InputGroup.Suffix>
          </InputGroup>
          <Separator orientation="vertical" />
          <Switch
            isSelected={includeDeleted}
            onChange={(e) => setIncludeDeleted(e)}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">Hiển thị đã xóa</Label>
            </Switch.Content>
          </Switch>
        </div>
        <div>
          <CourseAddModal refetch={refetch} />
        </div>
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Table with pagination"
            className="min-w-[600px]"
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Column isRowHeader={column.id === "name"}>
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body
              items={courses}
              renderEmptyState={() => <CustomEmptyState size={10} />}
            >
              {(course) => (
                <Table.Row>
                  <Table.Collection items={columns}>
                    <Table.Cell>{course.code}</Table.Cell>
                    <Table.Cell>{course.name}</Table.Cell>
                    <Table.Cell>{course.prerequisite}</Table.Cell>
                    <Table.Cell>
                      {course.deleted_at ? (
                        <Chip color="danger" size="sm" variant="primary">
                          Đã xóa
                        </Chip>
                      ) : (
                        <Chip
                          className="text-white dark:text-slate-950"
                          color="success"
                          size="sm"
                          variant="primary"
                        >
                          Đang hoạt động
                        </Chip>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip closeDelay={0} delay={0}>
                        <Button
                          isIconOnly
                          className="size-7 mr-1 bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                          onPress={() => setUpdatingCourse(course)}
                        >
                          <PencilToLine />
                        </Button>
                        <Tooltip.Content
                          showArrow
                          className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                          placement="top"
                        >
                          Chỉnh sửa môn học
                        </Tooltip.Content>
                      </Tooltip>
                      {!!!course.deleted_at ? (
                        <Tooltip closeDelay={0} delay={0}>
                          <Button
                            isIconOnly
                            className="size-7"
                            size="sm"
                            variant="danger-soft"
                            onPress={() => {
                              actionRef.current = () =>
                                handleDeleteCourse(course.id, course.code);
                              setIsConfirmationModalOpen(true);
                            }}
                          >
                            <TrashBin />
                          </Button>
                          <Tooltip.Content
                            showArrow
                            className="bg-danger-soft text-danger-soft-foreground"
                            placement="top"
                          >
                            Xóa môn học
                          </Tooltip.Content>
                        </Tooltip>
                      ) : (
                        <Tooltip closeDelay={0} delay={0}>
                          <Button
                            isIconOnly
                            className="size-7 bg-success-soft text-success-soft-foreground"
                            size="sm"
                            variant="danger-soft"
                            onPress={() => {
                              actionRef.current = () =>
                                handleRestoreCourse(course.id, course.code);
                              setIsConfirmationModalOpen(true);
                            }}
                          >
                            <ArrowUturnCwLeft />
                          </Button>
                          <Tooltip.Content
                            showArrow
                            className="bg-success-soft text-danger-success-foreground"
                            placement="top"
                          >
                            Khôi phục môn học
                          </Tooltip.Content>
                        </Tooltip>
                      )}
                    </Table.Cell>
                  </Table.Collection>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <Pagination size="sm">
            <Pagination.Summary>
              <Autocomplete
                aria-label="Số dòng trên trang"
                className="w-[100px]"
                placeholder="Select one"
                selectionMode="single"
                value={limit}
                onChange={(k) => {
                  setLimit(k ? (k as number) : ROWS_PER_PAGE);
                  setPage(1);
                }}
              >
                <Autocomplete.Trigger>
                  <Autocomplete.Value />
                  <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                  <ListBox renderEmptyState={() => <CustomEmptyState />}>
                    {PAGE_LIMIT_CHOICES.map((item) => (
                      <ListBox.Item key={item} id={item} textValue={`${item}`}>
                        {item}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Popover>
              </Autocomplete>
              <Separator orientation="vertical" variant="secondary" />
              <span>
                từ {from} đến {to} trong số {total} kết quả
              </span>
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Sau
                </Pagination.Previous>
              </Pagination.Item>
              {pages.map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === page}
                    onPress={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Tiếp
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
        {isLoading && <Overlay />}
      </Table>
    </>
  );
}

export default CourseTab;
