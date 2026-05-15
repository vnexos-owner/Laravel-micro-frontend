"use client";

import {
  Book,
  Calendar,
  GraduationCap,
  Persons,
  PersonWorker,
  SquareChartColumn,
  House,
} from "@gravity-ui/icons";
import { Card, Chip, Separator, Skeleton } from "@heroui/react";

import Overlay from "../overlay";

import { useGetStatisticQuery } from "@/store/queries/account";

// ─── Reusable sub-components ─────────────────────────────────────────────────

function IconBubble({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string; // tailwind bg + text classes
}) {
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${color}`}
    >
      {children}
    </div>
  );
}

function StatRow({
  label,
  value,
  isFetching,
  chip,
}: {
  label: string;
  value: React.ReactNode;
  isFetching: boolean;
  chip?: { color: "success" | "warning" | "danger" | "default" | "accent" };
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-default-500">{label}</span>
      {isFetching ? (
        <Skeleton className="h-5 w-10 rounded-md" />
      ) : chip ? (
        <Chip color={chip.color} size="sm" variant="soft">
          {value}
        </Chip>
      ) : (
        <span className="text-sm font-semibold text-default-700">
          {value ?? "—"}
        </span>
      )}
    </div>
  );
}

function SimpleCard({
  icon,
  iconColor,
  label,
  value,
  isFetching,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: React.ReactNode;
  isFetching: boolean;
}) {
  return (
    <Card className="flex-1">
      <Card.Content className="flex flex-row items-center gap-4 p-4">
        <IconBubble color={iconColor}>{icon}</IconBubble>
        <div className="min-w-0">
          <p className="text-xs text-default-400 uppercase tracking-wide font-medium">
            {label}
          </p>
          {isFetching ? (
            <Skeleton className="h-6 w-20 rounded-md mt-1" />
          ) : (
            <p className="text-2xl font-bold text-default-800 leading-tight">
              {value ?? "—"}
            </p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function StatisticTab() {
  const { data, isFetching } = useGetStatisticQuery(null);

  return (
    <div className="relative w-full space-y-4 p-1">
      {/* Row 1 — simple stat counters */}
      <div className="flex gap-4">
        <SimpleCard
          icon={<Book className="w-5 h-5" />}
          iconColor="bg-secondary/10 text-secondary"
          isFetching={isFetching}
          label="Tổng số môn học"
          value={data?.course}
        />
        <SimpleCard
          icon={<House className="w-5 h-5" />}
          iconColor="bg-primary/10 text-primary"
          isFetching={isFetching}
          label="Lớp kỳ này"
          value={data?.class.current}
        />
        <SimpleCard
          icon={<SquareChartColumn className="w-5 h-5" />}
          iconColor="bg-warning/10 text-warning"
          isFetching={isFetching}
          label="Tổng số lớp"
          value={data?.class.total}
        />
      </div>

      {/* Row 2 — users detail + semester */}
      <div className="flex gap-4">
        {/* Users card */}
        <Card className="flex-1">
          <Card.Header className="flex flex-row items-center gap-3 pb-2">
            <IconBubble color="bg-success/10 text-success">
              <Persons className="w-5 h-5" />
            </IconBubble>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium">
                Người dùng
              </p>
              {isFetching ? (
                <Skeleton className="h-7 w-16 rounded-md mt-0.5" />
              ) : (
                <p className="text-2xl font-bold text-default-800 leading-tight">
                  {data?.users.total ?? "—"}
                  <span className="text-sm font-normal text-default-400 ml-1.5">
                    tổng cộng
                  </span>
                </p>
              )}
            </div>
          </Card.Header>

          <Separator />

          <Card.Content className="py-1 px-4 space-y-0">
            <StatRow
              isFetching={isFetching}
              label="Quản trị viên"
              value={data?.users.admin}
            />
            <StatRow
              isFetching={isFetching}
              label="Giáo viên"
              value={data?.users.teacher}
            />
            <StatRow
              chip={{ color: "danger" }}
              isFetching={isFetching}
              label="Đã xóa"
              value={data?.users.deleted ?? 0}
            />
          </Card.Content>

          <Card.Footer className="pt-0 pb-3 px-4 flex gap-3 text-xs text-default-400">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Giáo viên: {isFetching ? "…" : data?.users.teacher}
            </span>
            <span className="flex items-center gap-1">
              <PersonWorker className="w-3.5 h-3.5" />
              Quản trị: {isFetching ? "…" : data?.users.admin}
            </span>
          </Card.Footer>
        </Card>

        {/* Current semester card */}
        <Card className="flex-1">
          <Card.Content className="flex flex-row items-center gap-4 p-5">
            <IconBubble color="bg-primary/10 text-primary">
              <Calendar className="w-5 h-5" />
            </IconBubble>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium mb-1">
                Kỳ học hiện tại
              </p>
              {isFetching ? (
                <Skeleton className="h-6 w-36 rounded-md" />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-lg font-bold text-default-800 leading-tight">
                    {data?.current_semester.name ?? "—"}
                  </p>
                  <Chip color="success" size="sm" variant="soft">
                    Đang diễn ra
                  </Chip>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>

      {isFetching && <Overlay />}
    </div>
  );
}

export default StatisticTab;
