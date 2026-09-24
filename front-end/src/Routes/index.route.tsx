import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/class/Header.component";
import ClassList from "../Components/class/List.component";
import Pagination from "../Components/Pagination.component";
import { useJWT } from "../Contexts/JWT.context";
import { useClasses } from "../Hooks/Class.hook";

export default function MainPage(): JSX.Element | null {
  const { user, logout } = useJWT();
  const navigate = useNavigate();
  const {
    classes,
    isLoading,
    error,
    getAllClasses,
    currentPage,
    totalPages,
    clearCache,
    clearError,
  } = useClasses();

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const handlePageChange = (newPage: number): void => {
    getAllClasses(newPage, debouncedSearch);
  };

  const handleClearSearch = (): void => {
    setSearch("");
    setDebouncedSearch("");
  };

  const handleRetry = (): void => {
    clearError();
    getAllClasses(currentPage, debouncedSearch);
  };

  const handleRefresh = (): void => {
    clearCache();
    getAllClasses(1, debouncedSearch);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (user) {
      getAllClasses(1, debouncedSearch);
    }
  }, [user, getAllClasses, debouncedSearch]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-4 md:p-8 flex flex-col gap-8 transition-colors duration-300">
      <Header
        user={user}
        search={search}
        onSearchChange={setSearch}
        onClearSearch={handleClearSearch}
        onLogout={logout}
        onRefresh={handleRefresh}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
          <ClassList
            classes={classes}
            isLoading={isLoading}
            error={error}
            userRole={user.role}
            debouncedSearch={debouncedSearch}
            onClearSearch={handleClearSearch}
            onRetry={handleRetry}
            onUpdated={handleRefresh}
          />
        </div>

        {/* Global Pagination */}
        {!error && classes.length > 0 && (
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
