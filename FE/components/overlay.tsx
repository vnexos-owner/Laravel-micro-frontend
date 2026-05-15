import { ProgressCircle } from "@heroui/react";

export default function Overlay() {
  return (
    <div className="w-full h-full absolute inset-0 flex flex-col justify-center items-center bg-white/50 dark:bg-slate-950/50">
      <ProgressCircle isIndeterminate aria-label="Loading" size="lg">
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>
    </div>
  );
}
