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
  Avatar,
  SearchField,
  Key,
  ProgressCircle,
} from "@heroui/react";
import { useRef, useState } from "react";
import {
  ArrowUturnCwLeft,
  Gear,
  PencilToLine,
  TrashBin,
} from "@gravity-ui/icons";

import Overlay from "../../overlay";
import ConfirmationModal from "../../confirmation-modal";
import { SearchIcon } from "../../icons";

import ClassAddModal from "./ClassAddModal";
import ClassUpdateModal from "./ClassUpdateModal";
import ClassManageModal from "./ClassManageModal";

import { Class, Semester } from "@/types";
import { PAGE_LIMIT_CHOICES } from "@/config";
import {
  useDeleteClassMutation,
  useGetClassesQuery,
  useRestoreClassMutation,
} from "@/store/queries/classes";
import CustomEmptyState from "@/components/EmptyState";
import { useGetSemestersQuery } from "@/store/queries/semester";

const ROWS_PER_PAGE = 5;

const columns = [
  { id: "name", name: "Tên lớp học" },
  { id: "semester", name: "Học kỳ" },
  { id: "homeroomTeacher", name: "Giáo viên chủ nhiệm" },
  { id: "status", name: "Trạng thái" },
  { id: "action", name: "Hành động" },
];

function ClassTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<Key | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(ROWS_PER_PAGE);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const {
    data: classResponse,
    isFetching: isLoading,
    refetch,
  } = useGetClassesQuery({
    page,
    search,
    includeDeleted,
    limit,
    semester_id: semesterFilter?.toString() ?? undefined,
  });
  const {
    data: semesters,
    isFetching: isSemesterFetching,
    // refetch,
  } = useGetSemestersQuery({});

  const classes: Class[] = classResponse?.data ?? [];
  const totalPages = classResponse?.last_page ?? 1;
  const total = classResponse?.total ?? 0;
  const from = classResponse?.from ?? 0;
  const to = classResponse?.to ?? 0;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const actionRef = useRef<() => unknown>(() => {});
  const [updatingClass, setUpdatingClass] = useState<Class | undefined>();
  const [managingClass, setManagingClass] = useState<Class | null>(null);
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();
  const [restoreClass, { isLoading: isRestoring }] = useRestoreClassMutation();

  const handleConfirm = (v: boolean) => {
    if (v) actionRef.current();
  };

  const handleDeleteClass = async (id: string, name: string) => {
    try {
      await deleteClass(id).unwrap();
      refetch();
      toast.success(`Xóa thành công lớp học ${name}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi xóa lớp học.");
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  const handleRestoreClass = async (id: string, name: string) => {
    try {
      await restoreClass(id).unwrap();
      refetch();
      toast.success(`Khôi phục thành công lớp học ${name}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi khôi phục lớp học.");
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
      <ClassManageModal clazz={managingClass} setClass={setManagingClass} />
      <ClassUpdateModal
        clazz={updatingClass}
        refetch={refetch}
        setClass={setUpdatingClass}
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
          <Autocomplete
            allowsEmptyCollection
            aria-label="Chọn học kỳ"
            className="w-[256px]"
            isDisabled={isSemesterFetching}
            placeholder="Lọc theo học kỳ..."
            selectionMode="single"
            value={semesterFilter}
            variant="secondary"
            onChange={setSemesterFilter}
          >
            <Autocomplete.Trigger>
              <Autocomplete.Value />
              <Autocomplete.ClearButton />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter>
                <SearchField name="search" variant="secondary">
                  <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder="Search states..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox
                  renderEmptyState={() =>
                    isSemesterFetching ? (
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
                  {semesters?.map((item: Semester) => (
                    <ListBox.Item
                      key={item.id}
                      id={item.id}
                      textValue={item.name}
                    >
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
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
          <ClassAddModal refetch={refetch} />
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
              items={classes}
              renderEmptyState={() => <CustomEmptyState size={10} />}
            >
              {(clazz) => (
                <Table.Row>
                  <Table.Collection items={columns}>
                    <Table.Cell>{clazz.name}</Table.Cell>
                    <Table.Cell>{clazz.semester.name}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar className="unselectable" size="sm">
                          <Avatar.Image
                            src={clazz.homeroom_teacher.avatar ?? ""}
                          />
                          <Avatar.Fallback>
                            {((n) =>
                              n.length > 1
                                ? n[0][0] + n.slice(-1)[0][0]
                                : n[0][0])(
                              clazz.homeroom_teacher.name.trim().split(/\s+/),
                            ).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {clazz.homeroom_teacher.name}
                          </span>
                          <span className="text-xs text-muted">
                            {clazz.homeroom_teacher.username}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {clazz.deleted_at ? (
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
                          className="size-7 mr-1 bg-green-200/50 text-green-500"
                          onPress={() => setManagingClass(clazz)}
                        >
                          <Gear />
                        </Button>
                        <Tooltip.Content
                          showArrow
                          className="bg-green-200/50 text-green-500"
                          placement="top"
                        >
                          Quản lý lớp học
                        </Tooltip.Content>
                      </Tooltip>
                      <Tooltip closeDelay={0} delay={0}>
                        <Button
                          isIconOnly
                          className="size-7 mr-1 bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                          onPress={() => setUpdatingClass(clazz)}
                        >
                          <PencilToLine />
                        </Button>
                        <Tooltip.Content
                          showArrow
                          className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
                          placement="top"
                        >
                          Cập nhật lớp học
                        </Tooltip.Content>
                      </Tooltip>
                      {!!!clazz.deleted_at ? (
                        <Tooltip closeDelay={0} delay={0}>
                          <Button
                            isIconOnly
                            className="size-7"
                            size="sm"
                            variant="danger-soft"
                            onPress={() => {
                              actionRef.current = () =>
                                handleDeleteClass(clazz.id, clazz.name);
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
                            Xóa lớp học
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
                                handleRestoreClass(clazz.id, clazz.name);
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
                            Khôi phục lớp học
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

export default ClassTab;
