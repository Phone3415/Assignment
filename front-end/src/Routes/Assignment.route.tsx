import { JSX, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentHeader from "../Components/assignment/Header.component";
import AssignmentTable from "../Components/assignment/Table.component";
import EmptyState from "../Components/common/EmptyState.component";
import ErrorState from "../Components/common/ErrorState.component";
import Pagination from "../Components/Pagination.component";
import { useJWT } from "../Contexts/JWT.context";
import { useAssignments } from "../Hooks/Assignment.hook";
import { AssignmentStatus } from "../Types/assignment.type";

export default function AssigmentPage(): JSX.Element | null {
  const { user, logout } = useJWT();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const numericClassId = classId ? parseInt(classId, 10) : NaN;
  const isValidClassId = !isNaN(numericClassId) && numericClassId > 0;

  const {
    assignments,
    isLoading,
    error,
    currentPage,
    totalPages,
    getAssignments,
    submitAssignment,
    unsubmitAssignment,
    clearCache,
    clearError,
  } = useAssignments(isValidClassId ? numericClassId : 0);

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "">("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch when classId, debounced search, or status filter changes
  useEffect(() => {
    if (!isValidClassId) return;
    getAssignments({ page: 1, search: debouncedSearch, status: statusFilter });
  }, [isValidClassId, debouncedSearch, statusFilter, getAssignments]);

  // Auth guard
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePageChange = (newPage: number): void => {
    getAssignments({
      page: newPage,
      search: debouncedSearch,
      status: statusFilter,
    });
  };

  const handleClearSearch = (): void => {
    setSearch("");
    setDebouncedSearch("");
  };

  const handleResetFilters = (): void => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
  };

  const handleRefresh = useCallback((): void => {
    clearCache();
    getAssignments({
      page: 1,
      search: debouncedSearch,
      status: statusFilter,
    });
  }, [clearCache, getAssignments, debouncedSearch, statusFilter]);

  const handleRetry = (): void => {
    clearError();
    getAssignments({
      page: currentPage,
      search: debouncedSearch,
      status: statusFilter,
    });
  };

  if (!user) {
    return null;
  }

  if (!isValidClassId) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-4 md:p-8 flex items-center justify-center">
        <ErrorState
          title="ไม่พบรหัสห้องเรียน"
          message="รหัสวิชาใน URL ไม่ถูกต้อง กรุณากลับสู่หน้ารายการวิชา"
          onRetry={() => navigate("/")}
        />
      </div>
    );
  }

  const isFiltering = !!(debouncedSearch || statusFilter);

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-4 md:p-8 flex flex-col gap-6 transition-colors duration-300">
      {/* Header with Search and Filter */}
      <AssignmentHeader
        classId={numericClassId}
        user={user}
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onClearSearch={handleClearSearch}
        onStatusFilterChange={setStatusFilter}
        onLogout={logout}
        onRefresh={handleRefresh}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between">
        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : !isLoading && assignments.length === 0 ? (
          <EmptyState
            title={
              isFiltering
                ? "ไม่พบงานตามเงื่อนไขที่ค้นหา"
                : "ยังไม่มีงานในรายวิชานี้"
            }
            description={
              isFiltering
                ? "ลองตรวจสอบคำค้นหาหรือเปลี่ยนตัวกรองสถานะ"
                : user.role === "Admin"
                ? "คุณสามารถกดปุ่ม 'เพิ่มงาน' ด้านบนเพื่อเริ่มมอบหมายงานใหม่"
                : "ยังไม่มีการมอบหมายงานในวิชานี้ เมื่อมีงานใหม่จะแสดงที่นี่"
            }
            actionText={isFiltering ? "ล้างตัวกรองทั้งหมด" : undefined}
            onAction={isFiltering ? handleResetFilters : undefined}
          />
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <AssignmentTable
              assignments={assignments}
              userRole={user.role}
              classId={numericClassId}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onSubmit={submitAssignment}
              onUnsubmit={unsubmitAssignment}
            />
          </div>
        )}

        {/* Pagination */}
        {!error && assignments.length > 0 && totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
