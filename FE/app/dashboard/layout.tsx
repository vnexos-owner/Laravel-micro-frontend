"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import Overlay from "@/components/overlay";
import { useAppSelector } from "@/store/hooks";
import { User } from "@/types";
import { checkRole } from "@/utils/checkUserRole";

function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAppSelector((state: any) => state.auth.user as User);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!checkRole(user, "admin")) router.push("/");
    else setIsChecking(false);
  }, [user]);

  return isChecking ? <Overlay /> : children;
}

export default DashboardLayout;
