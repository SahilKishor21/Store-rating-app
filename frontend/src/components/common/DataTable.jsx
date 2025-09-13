import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingSpinner, { LoadingTableRow } from './LoadingSpinner';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  searchPlaceholder = "Search...",
  searchValue = "",
  sortField,
  sortOrder,
  className
}) => {
  const handleSort = (field) => {
    if (onSort) {
      const newOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
      onSort(`${field}:${newOrder}`);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'ASC' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Controls */}
      {(onSearch || onPageSizeChange) && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {onSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          
          {onPageSizeChange && pagination && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select
                value={pagination.itemsPerPage?.toString()}
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.accessorKey}
                  className={cn(
                    column.sortable && "cursor-pointer select-none hover:bg-muted/50",
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.accessorKey)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && getSortIcon(column.accessorKey)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingTableRow key={index} />
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey} className={column.className}>
                      {column.cell ? 
                        column.cell(item) : 
                        item[column.accessorKey]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.currentPage * pagination.itemsPerPage + 1} to{' '}
            {Math.min(
              (pagination.currentPage + 1) * pagination.itemsPerPage,
              pagination.totalItems
            )}{' '}
            of {pagination.totalItems} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (pagination.totalPages <= 5) {
                  pageNumber = i;
                } else {
                  const start = Math.max(0, pagination.currentPage - 2);
                  pageNumber = start + i;
                }
                
                if (pageNumber >= pagination.totalPages) return null;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === pagination.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1 || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;