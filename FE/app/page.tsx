"use client";

import { Skeleton } from "@heroui/react";

import { title } from "@/components/primitives";
import TeacherClassManagement from "@/components/TeacherClassManagement";
import { useAppSelector } from "@/store/hooks";
import { useGetCurrentSemesterQuery } from "@/store/queries/semester";
import { checkRole } from "@/utils/checkUserRole";
import ClassList from "@/components/dashboard/ClassList";

export default function Home() {
  const user = useAppSelector((state: any) => state.auth.user);
  const { data: currentSemester, isFetching } =
    useGetCurrentSemesterQuery(null);

  return user ? (
    checkRole(user, "teacher") ? (
      <main className="w-full">
        <h4 className={title({ size: "sm" })}>Quản lý lớp học</h4>
        <div className="text-muted flex gap-1 items-center">
          <strong>Học kỳ hiện tại:</strong>
          {isFetching ? (
            <Skeleton className="h-3 w-25 rounded-lg" />
          ) : (
            <span>{currentSemester?.name}</span>
          )}
        </div>
        <div className="w-full min-h-10 px-5 py-2.5 mt-5 bg-segment rounded-2xl">
          <TeacherClassManagement />
        </div>
      </main>
    ) : (
      <main className="w-full">
        <h4 className={title({ size: "sm" })}>Danh sách lớp học</h4>
        <ClassList />
      </main>
    )
  ) : (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Chào mừng bạn đến với&nbsp;</span>
        <span className={title({ color: "blue" })}>RIKAI&nbsp;</span>
        <span className={title()}>!!!</span>
      </div>
    </section>
  );
}
