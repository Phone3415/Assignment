import { JSX, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination.component";
import Header from "../Components/student/Header.component";
import UserTable from "../Components/student/Table.component";
import { useJWT } from "../Contexts/JWT.context";
import { useUsers } from "../Hooks/User.hook";
import { User } from "../Types/auth.type";

export default function StudentPage(): JSX.Element | null {
  const { user } = useJWT();
  const navigate = useNavigate();
  const { fetchUsers } = useUsers();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const cursors = useRef<Record<number, string | undefined>>({ 1: undefined });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "Admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
    cursors.current = { 1: undefined };
  }, [debouncedSearch]);

  const loadUsers = async (page: number = currentPage) => {
    setIsLoading(true);
    
    const cursor = cursors.current[page];
    const { data, totalPages: fetchedTotalPages } = await fetchUsers(
      debouncedSearch,
      undefined,
      cursor,
      10
    );

    if (data.length > 0) {
      const lastUser = data[data.length - 1];
      cursors.current[page + 1] = `${lastUser.id}__$__${lastUser.createdAt}`;
    }

    setUsers(data);
    setTotalPages(fetchedTotalPages);
    setCurrentPage(page);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && user.role === "Admin") {
      loadUsers(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, debouncedSearch, currentPage]);

  if (!user || user.role !== "Admin") {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-4 md:p-8 flex flex-col gap-6 transition-colors duration-300">
      <Header
        searchTerm={search}
        onSearchChange={setSearch}
        onRefresh={() => loadUsers(currentPage)}
      />

      <main className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300">
        <UserTable
          users={users}
          isLoading={isLoading}
          onRefresh={() => loadUsers(currentPage)}
        />
        
        {!isLoading && users.length > 0 && totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
