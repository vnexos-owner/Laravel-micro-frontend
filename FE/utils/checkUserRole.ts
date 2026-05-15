import { User } from "@/types";

export function checkRole(user: User | undefined, role: string) {
  return !!user?.roles.find((val) => role === val);
}
