import { Avatar, Dropdown, Label } from "@heroui/react";
import { ArrowRightFromSquare, DisplayPulse, Person } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";

import { User } from "@/types";
import { useSignoutMutation } from "@/store/queries/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signout } from "@/store/slices/authSlice";
import { checkRole } from "@/utils/checkUserRole";

function UserDropdown({ user }: { user: User }) {
  const [signOut, { isLoading }] = useSignoutMutation();

  const dispatch = useAppDispatch();
  const refToken = useAppSelector((state: any) => state.auth.refreshToken);
  const router = useRouter();

  const handleLogout = () => {
    signOut({ refresh_token: refToken }).unwrap();

    dispatch(signout());
    router.push("/");
  };

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <div className="px-3">
          <div className="flex items-center gap-2">
            <Avatar className="unselectable" size="sm">
              <Avatar.Image alt="Jane" src={user.avatar ?? ""} />
              <Avatar.Fallback delayMs={600}>
                {((n) =>
                  n.length > 1 ? n[0][0] + n.slice(-1)[0][0] : n[0][0])(
                  user.name.trim().split(/\s+/),
                ).toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col items-start gap-0">
              <p className="text-sm leading-5 font-medium">{user.name}</p>
              <p className="text-xs leading-none text-muted">{user.username}</p>
            </div>
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu>
          {checkRole(user, "admin") && (
            <Dropdown.Item
              id="dashboard"
              textValue="Dashboard"
              onClick={() => router.push("/dashboard")}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Bảng điều khiển</Label>
                <DisplayPulse className="size-3.5 text-muted" />
              </div>
            </Dropdown.Item>
          )}
          <Dropdown.Item id="profile" textValue="Profile">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Trang cá nhân</Label>
              <Person className="size-3.5 text-muted" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            id="logout"
            isDisabled={isLoading}
            shouldCloseOnSelect={false}
            textValue="Logout"
            variant="danger"
            onClick={handleLogout}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Đăng xuất</Label>
              <ArrowRightFromSquare className="size-3.5 text-danger" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default UserDropdown;
