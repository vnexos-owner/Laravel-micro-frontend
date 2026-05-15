import { FolderOpen } from "@gravity-ui/icons";
import { EmptyState } from "@heroui/react";

interface CustomEmptyStateProps {
  message?: string;
  size?: number;
}
function CustomEmptyState({
  message = "Không có kết quả",
  size = 5,
}: CustomEmptyStateProps) {
  return (
    <EmptyState className="w-full text-muted flex flex-col justify-center items-center">
      <FolderOpen className={`size-${size}`} />
      <p>{message}</p>
    </EmptyState>
  );
}

export default CustomEmptyState;
