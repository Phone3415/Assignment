import { JSX } from "react";
import { ClassData, UserRole } from "../../Types";
import ClassSkeleton from "../common/ClassSkeleton.component";
import EmptyState from "../common/EmptyState.component";
import ErrorState from "../common/ErrorState.component";
import ClassTile from "./Tile.component";

interface ClassListProps {
  classes: ClassData[];
  isLoading: boolean;
  error: string | null;
  userRole: UserRole;
  debouncedSearch: string;
  onClearSearch: () => void;
  onRetry: () => void;
  onUpdated: () => void;
}

export default function ClassList({
  classes,
  isLoading,
  error,
  userRole,
  debouncedSearch,
  onClearSearch,
  onRetry,
  onUpdated,
}: ClassListProps): JSX.Element {
  if (isLoading && classes.length === 0) {
    return <ClassSkeleton count={6} />;
  }

  if (error) {
    return (
      <ErrorState
        title="เกิดข้อผิดพลาดในการโหลดวิชาเรียน"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (classes.length === 0) {
    return (
      <EmptyState
        title={
          debouncedSearch
            ? "ไม่พบวิชาเรียนที่คุณค้นหา"
            : "ยังไม่มีข้อมูลวิชาเรียน"
        }
        description={
          debouncedSearch
            ? `ไม่พบผลการค้นหาสำหรับ "${debouncedSearch}" ลองตรวจสอบคำค้นหาใหม่อีกครั้ง`
            : "ขณะนี้ยังไม่มีวิชาเรียนในระบบ"
        }
        actionText={debouncedSearch ? "ล้างการค้นหา" : undefined}
        onAction={debouncedSearch ? onClearSearch : undefined}
      />
    );
  }

  return (
    <>
      {classes.map((cls, index) => (
        <ClassTile
          key={cls.id}
          order={index + 1}
          id={cls.id}
          name={cls.name}
          userRole={userRole}
          onUpdated={onUpdated}
        />
      ))}
    </>
  );
}
