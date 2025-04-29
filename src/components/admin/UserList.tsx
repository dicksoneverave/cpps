
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserData } from "@/types/adminTypes";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface UserListProps {
  title: string;
  users: UserData[];
  selectedUser: UserData | null;
  onSelectUser: (user: UserData) => void;
  emptyMessage?: string;
  totalUsers?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const UserList: React.FC<UserListProps> = ({
  title,
  users,
  selectedUser,
  onSelectUser,
  emptyMessage = "No users available",
  totalUsers = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    if (totalPages > 1) {
      pageNumbers.push(1);
    }
    
    // Add current and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pageNumbers[pageNumbers.length - 1] !== i - 1) {
        // Add ellipsis if there's a gap
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      pageNumbers.push(i);
    }
    
    // Always show last page if there are multiple pages
    if (totalPages > 1 && pageNumbers[pageNumbers.length - 1] !== totalPages) {
      if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
        // Add ellipsis if there's a gap
        pageNumbers.push(-1);
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium mb-2">
        {title} {totalUsers > 0 && <span className="text-sm text-muted-foreground">({totalUsers} users)</span>}
      </h3>
      <ScrollArea className="flex-1 border rounded-md p-2 h-[400px]">
        <div className="space-y-1">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`p-2 cursor-pointer rounded ${
                  selectedUser?.id === user.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => onSelectUser(user)}
              >
                <div className="font-medium">{user.name || "Unknown name"}</div>
                <div className="text-sm text-muted-foreground">{user.email || "Unknown email"}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 p-2">{emptyMessage}</div>
          )}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => 
              page === -1 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UserList;
