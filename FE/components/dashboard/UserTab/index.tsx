import {
  Avatar,
  Autocomplete,
  Button,
  Chip,
  Modal,
  Pagination,
  Table,
  SearchField,
  ListBox,
  Description,
  Key,
  toast,
  InputGroup,
  Switch,
  Label,
  Separator,
  Tooltip,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { ArrowUturnCwLeft, Plus, TrashBin, Xmark } from "@gravity-ui/icons";

import Overlay from "../../overlay";
import ConfirmationModal from "../../confirmation-modal";
import { SearchIcon } from "../../icons";

import UserAddModal from "./UserAddModal";

import { User } from "@/types";
import { useAppSelector } from "@/store/hooks";
import { PAGE_LIMIT_CHOICES } from "@/config";
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useRestoreUserMutation,
} from "@/store/queries/account";
import CustomEmptyState from "@/components/EmptyState";

const ROWS_PER_PAGE = 10;

const columns = [
  { id: "name", name: "Người dùng" },
  { id: "email", name: "Email" },
  { id: "role", name: "Quyền hạn" },
  { id: "status", name: "Trạng thái" },
  { id: "action", name: "Hành động" },
];

const roleRecord: any = {
  admin: { name: "Quản trị viên", color: "success" },
  teacher: { name: "Giáo viên", color: "warning" },
  default: { name: "Mặc định", color: "default" },
};

function RoleAddModal({
  userId,
  roles,
  id,
  refetch,
}: {
  id: string;
  userId: string;
  roles: string[];
  refetch: () => unknown;
}) {
  const [addRole, { isLoading }] = useAddRoleMutation();
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) setSelectedKey(null);
  }, [isOpen]);

  const customFilter = (textValue: string, inputValue: string) => {
    const role = roleRecord[textValue];

    return (
      role.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      role.description?.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleAddingRole = useCallback(async () => {
    try {
      await addRole({ userId, roleName: selectedKey as string }).unwrap();

      setIsOpen(false);
      toast("Thêm quyền thành công!", { variant: "success" });
      refetch();
    } catch {
      toast("Đã có lỗi xảy ra!", { variant: "danger" });
    }
  }, [selectedKey]);

  return (
    <Modal>
      <Button
        isIconOnly
        className="size-5"
        isDisabled={id === userId}
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="size-2.5" />
      </Button>
      <Modal.Backdrop
        isOpen={isOpen}
        shouldCloseOnInteractOutside={() => !isLoading}
        onOpenChange={setIsOpen}
      >
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-success-soft text-success">
                <Plus className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Thêm quyền hạn</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Autocomplete
                aria-label="Chọn quyền hạn"
                isDisabled={isLoading}
                placeholder="Chọn quyền hạn"
                selectionMode="single"
                value={selectedKey}
                onChange={setSelectedKey}
              >
                <Autocomplete.Trigger>
                  <Autocomplete.Value aria-label="Quyền" />
                  <Autocomplete.ClearButton />
                  <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                  <Autocomplete.Filter filter={customFilter}>
                    <SearchField
                      aria-label="Tìm kiếm"
                      name="search"
                      variant="secondary"
                    >
                      <SearchField.Group>
                        <SearchField.SearchIcon />
                        <SearchField.Input placeholder="Kiếm quyền hạn..." />
                        <SearchField.ClearButton />
                      </SearchField.Group>
                    </SearchField>
                    <ListBox
                      aria-label="Danh sách"
                      renderEmptyState={() => <CustomEmptyState />}
                    >
                      {Object.keys(roleRecord).map((item) => (
                        <ListBox.Item
                          key={item}
                          id={item}
                          isDisabled={!!roles.find((v) => v == item)}
                          textValue={item}
                        >
                          {roleRecord[item].name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Autocomplete.Filter>
                </Autocomplete.Popover>
                <Description>
                  Chọn một quyền hạn để thêm vào người dùng.
                </Description>
              </Autocomplete>
            </Modal.Body>
            <Modal.Footer>
              <Button isPending={isLoading} slot="close" variant="secondary">
                Hủy
              </Button>
              <Button
                isDisabled={!!!selectedKey}
                isPending={isLoading}
                onClick={handleAddingRole}
              >
                Thêm
              </Button>
            </Modal.Footer>
            {isLoading && <Overlay />}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function RoleCell({
  userId,
  roles,
  refetch,
  isDelete,
}: {
  userId: string;
  roles: string[];
  refetch: () => unknown;
  isDelete: boolean;
}) {
  const user = useAppSelector((state: any) => state.auth.user as User);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();

  const [action, setAction] = useState<() => unknown>(() => {});

  const handleConfirm = (v: boolean) => {
    if (v) action();
  };

  const handleDelete = (role: string) => async () => {
    try {
      await deleteRole({ userId, roleName: role }).unwrap();

      toast("Xóa quyền thành công!", { variant: "success" });
      refetch();
    } catch {
      toast("Xóa quyền thất bại!", { variant: "danger" });
    } finally {
      setIsConfirmationOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      <ConfirmationModal
        isLoading={isLoading}
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        onConfirm={handleConfirm}
      />
      {roles.map((val) => (
        <div key={val} className="group relative">
          <Chip
            className="flex items-center gap-1 pr-1 transition-all duration-200"
            color={roleRecord[val].color}
            size="sm"
            variant="soft"
          >
            <span>{roleRecord[val].name}</span>
            {user?.id !== userId &&
              roles.length > 1 &&
              !isDelete &&
              val !== "default" && (
                <Button
                  isIconOnly
                  className="
        opacity-0 size-0 overflow-hidden
        transition-all duration-200 ease-in-out
        group-hover:size-3 group-hover:opacity-100 group-hover:scale-100
        flex items-center justify-center"
                  type="button"
                  variant="danger-soft"
                  onClick={() => {
                    setIsConfirmationOpen(true);
                    setAction(() => handleDelete(val));
                  }}
                >
                  <Xmark className="size-2.5" />
                </Button>
              )}
          </Chip>
        </div>
      ))}
      {isDelete || (
        <RoleAddModal
          id={user?.id}
          refetch={refetch}
          roles={roles}
          userId={userId}
        />
      )}
    </div>
  );
}

function UserTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(ROWS_PER_PAGE);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const {
    data: usersResponse,
    isFetching: isLoading,
    refetch,
  } = useGetUsersQuery({ page, search, includeDeleted, limit });

  const currUser = useAppSelector((state: any) => state.auth.user);
  const users: User[] = usersResponse?.data ?? [];
  const totalPages = usersResponse?.last_page ?? 1;
  const total = usersResponse?.total ?? 0;
  const from = usersResponse?.from ?? 0;
  const to = usersResponse?.to ?? 0;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [action, setAction] = useState<() => unknown>(() => {});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [restoreUser, { isLoading: isRestoring }] = useRestoreUserMutation();

  const handleConfirm = (v: boolean) => {
    if (v) action();
  };

  const handleDeleteUser = async (id: string, name: string) => {
    try {
      await deleteUser(id).unwrap();
      refetch();
      toast.success(`Xóa thành công người dùng ${name}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi xóa người dùng.");
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  const handleRestoreUser = async (id: string, name: string) => {
    try {
      await restoreUser(id).unwrap();
      refetch();
      toast.success(`Khôi phục thành công người dùng ${name}`);
    } catch {
      toast.danger("Có lỗi xảy ra khi khôi phục người dùng.");
    } finally {
      setIsConfirmationModalOpen(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        isLoading={isRestoring || isDeleting}
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        onConfirm={handleConfirm}
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
          <UserAddModal refetch={refetch} />
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
              items={users}
              renderEmptyState={() => <CustomEmptyState size={10} />}
            >
              {(user) => (
                <Table.Row>
                  <Table.Collection items={columns}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar className="unselectable" size="sm">
                          <Avatar.Image src={user.avatar ?? ""} />
                          <Avatar.Fallback>
                            {((n) =>
                              n.length > 1
                                ? n[0][0] + n.slice(-1)[0][0]
                                : n[0][0])(
                              user.name.trim().split(/\s+/),
                            ).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs">{user.name}</span>
                          <span className="text-xs text-muted">
                            {user.username}
                          </span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell className="gap-0.5">
                      <RoleCell
                        isDelete={user.deleted_at !== null}
                        refetch={refetch}
                        roles={user.roles}
                        userId={user.id}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {user.deleted_at ? (
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
                      {!!!user.deleted_at ? (
                        <Tooltip closeDelay={0} delay={0}>
                          <Button
                            isIconOnly
                            className="size-7"
                            isDisabled={user?.id === currUser?.id}
                            size="sm"
                            variant="danger-soft"
                            onClick={() => {
                              setAction(
                                () => () =>
                                  handleDeleteUser(user.id, user.name),
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
                            Xóa người dùng
                          </Tooltip.Content>
                        </Tooltip>
                      ) : (
                        <Tooltip closeDelay={0} delay={0}>
                          <Button
                            isIconOnly
                            className="size-7 bg-success-soft text-success-soft-foreground"
                            isDisabled={user?.id === currUser?.id}
                            size="sm"
                            variant="danger-soft"
                            onClick={() => {
                              setAction(
                                () => () =>
                                  handleRestoreUser(user.id, user.name),
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
                            Khôi phục người dùng
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

export default UserTab;
