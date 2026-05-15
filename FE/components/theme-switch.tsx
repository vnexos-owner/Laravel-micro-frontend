"use client";

import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Moon, Sun } from "@gravity-ui/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = resolvedTheme === "light";

  const handleToggle = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <button
      suppressHydrationWarning
      aria-label={
        mounted
          ? `Switch to ${isLight ? "dark" : "light"} mode`
          : "Switch theme"
      }
      className={clsx(
        "px-px transition-opacity hover:opacity-80 cursor-pointer",
        "inline-flex items-center justify-center",
        "w-auto h-auto bg-transparent rounded-lg text-muted",
        className,
      )}
      onClick={handleToggle}
    >
      {mounted ? (
        isLight ? (
          <Sun className="size-6" />
        ) : (
          <Moon className="size-6" />
        )
      ) : (
        <span style={{ width: 22, height: 22, display: "inline-block" }} />
      )}
    </button>
  );
};
