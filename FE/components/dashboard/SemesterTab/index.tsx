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
import { useState } from "react";
import { ArrowUturnCwLeft, PencilToLine, TrashBin } from "@gravity-ui/icons";

import Overlay from "../../overlay";
import ConfirmationModal from "../../confirmation-modal";
import { SearchIcon } from "../../icons";

import SemesterAddModal from "./SemesterAddModal";
import SemesterUpdateModal from "./SemesterUpdateModal";

import { Semester } from "@/types";
import { PAGE_LIMIT_CHOICES } from "@/config";
import {
  useDeleteSemesterMutation,
  useGetSemestersQuery,
  useRestoreSemesterMutation,
  useSetCurrentSemesterMutation,
} from "@/store/queries/semester";
import { formatDate } from "@/utils/dateUtils";
import CustomEmptyState from "@/components/EmptyState";

const ROWS_PER_PAGE = 5;

const columns = [
  { id: "name", name: "Học kỳ" },
  { id: "start_time", name: "Thời gian bắt đầu" },
  { id: "end_time", name: "Thời gian kết thúc" },
  { id: "is_current", name: "Hiện tại" },
  { id: "status", name: "Trạng thái" },
  { id: "action", name: "Hành động" },
];

function SemesterTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(ROWS_PER_PAGE);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const {
    data: semesterResponse,
    isFetching: isLoading,
    refetch,
  } = useGetSemestersQuery({ page, search, includeDeleted, limit });

  const semesters: Semester[] = semesterResponse?.data ?? [];
  const totalPages = semesterResponse?.last_page ?? 1;
  const total = semesterResponse?.total ?? 0;
  const from = semesterResponse?.from ?? 0;
  const to = semesterResponse?.to ?? 0;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [action, setAction] = useState<() => unknown>(() => {});
  const [updatingSemester, setUpdatingSemester] = useState<
    Semester | undefined
  >();
  const [deleteSemester, { isLoading: isDeleting }] =
    useDeleteSemesterMutation();
  const [restoreSemester, { isLoading: isRestoring }] =
    useRestoreSemesterMutation();
  const [setCurrentSemester, { isLoading: isSetting }] =
    useSetCurrentSemesterMutation();

  const handleConfirm = (v: boolean) => {
    if (v) action();
  };

  const handleSelected =
    (id: string, name: string) => async (selected: boolean) => {
      if (!selected) return;
      try {
        await setCurrentSemester(id).unwrap();

        toast.success(`Đã cài đặt học kỳ ${name} thành học kỳ hiện tại`);
        refetch();
      } catch {
        toast.danger(`Có lỗi xảy ra trong quá trình xóa học kỳ.`);
      }
    };

  const handleDeleteCourse = async (id: string, code: string) => {
    try {
      await deleteSemester(id).unwrap();
      refetch();
      toast.success(`Xóa thành công học kỳ ${code}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi xóa học kỳ.");
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  const handleRestoreCourse = async (id: string, code: string) => {
    try {
      await restoreSemester(id).unwrap();
      refetch();
      toast.success(`Khôi phục thành công học kỳ ${code}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi khôi phục học kỳ.");
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
      <SemesterUpdateModal
        refetch={refetch}
        semester={updatingSemester}
        setSemester={setUpdatingSemester}
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
          <SemesterAddModal refetch={refetch} />
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
              items={semesters}
              renderEmptyState={() => <CustomEmptyState size={10} />}
            >
              {(semester) => (
                <Table.Row>
                  <Table.Collection items={columns}>
                    <Table.Cell>{semester.name}</Table.Cell>
                    <Table.Cell>{formatDate(semester.start_time)}</Table.Cell>
                    <Table.Cell>{formatDate(semester.end_time)}</Table.Cell>
                    <Table.Cell>
                      <Switch
                        isSelected={semester.is_current}
                        onChange={handleSelected(semester.id, semester.name)}
                      >
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                    </Table.Cell>
                    <Table.Cell>
                      {semester.deleted_at ? (
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
                          className="size-7 mr-1 bg-blue-200/80 text-blue-500 dark:text-blue-700"
                          onPress={() => setUpdatingSemester(semester)}
                        >
                          <PencilToLine />
                        </Button>
                        <Tooltip.Content
                          showArrow
                          className="bg-blue-200/80 text-blue-500 dark:text-blue-700"
                          placement="top"
                        >
                          Chỉnh sửa học kỳ
                        </Tooltip.Content>
                      </Tooltip>
                      {!!!semester.deleted_at ? (
                        <Tooltip closeDelay={0} delay={0}>
                          <Button
                            isIconOnly
                            className="size-7"
                            size="sm"
                            variant="danger-soft"
                            onPress={() => {
                              setAction(
                                () => () =>
                                  handleDeleteCourse(
                                    semester.id,
                                    semester.name,
                                  ),
                              );
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
                            Xóa học kỳ
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
                              setAction(
                                () => () =>
                                  handleRestoreCourse(
                                    semester.id,
                                    semester.name,
                                  ),
                              );
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
                            Khôi phục học kỳ
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
        {(isLoading || isSetting) && <Overlay />}
      </Table>
    </>
  );
}

export default SemesterTab;
