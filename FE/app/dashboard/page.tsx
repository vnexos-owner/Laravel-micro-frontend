"use client";

import { Tabs } from "@heroui/react";

import UserTab from "@/components/dashboard/UserTab";
import { title } from "@/components/primitives";
import CourseTab from "@/components/dashboard/CourseTab";
import SemesterTab from "@/components/dashboard/SemesterTab";
import ClassTab from "@/components/dashboard/ClassTab";
import StatisticTab from "@/components/dashboard/StatisticTab";

function DashboardPage() {
  return (
    <main className="w-full">
      <h4 className={title({ size: "sm" })}>Bảng điều khiển</h4>
      <Tabs className="w-full mt-3" orientation="horizontal">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Dashboard" className="w-full">
            <Tabs.Tab id="statistic">
              Thống kê
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="users">
              Người dùng
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="courses">
              Môn học
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="semesters">
              Học kỳ
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="classes">
              Lớp học
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <div className="w-full min-h-10 px-5 py-2.5 mt-5 bg-segment rounded-2xl">
          <Tabs.Panel className="pt-4" id="statistic">
            <StatisticTab />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="users">
            <UserTab />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="courses">
            <CourseTab />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="semesters">
            <SemesterTab />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="classes">
            <ClassTab />
          </Tabs.Panel>
        </div>
      </Tabs>
    </main>
  );
}

export default DashboardPage;
