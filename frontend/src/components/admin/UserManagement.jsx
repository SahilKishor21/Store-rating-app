import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import UserForm from './UserForm';
import ConfirmDialog from '../common/ConfirmDialog';
import useUserStore from '@/stores/userStore';
import { ROLE_LABELS, PAGINATION } from '@/utils/constants';
import { formatDateTime } from '@/lib/utils';

const UserManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const { 
    users, 
    isLoading, 
    pagination, 
    fetchUsers, 
    deleteUser 
  } = useUserStore();

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, searchTerm, sortField, sortOrder]);

  const loadUsers = () => {
    const params = {
      page: currentPage,
      size: pageSize,
      search: searchTerm,
      sort: `${sortField}:${sortOrder}`
    };
    fetchUsers(params);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    }
  };

  const handleFormSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleSort = (sort) => {
    const [field, order] = sort.split(':');
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(0);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      store_owner: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return colors[role] || colors.user;
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      sortable: true,
      cell: (user) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Role',
      sortable: true,
      cell: (user) => (
        <Badge className={getRoleBadgeColor(user.role)}>
          {ROLE_LABELS[user.role]}
        </Badge>
      )
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: (user) => (
        <div className="max-w-xs truncate" title={user.address}>
          {user.address || 'N/A'}
        </div>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      sortable: true,
      cell: (user) => formatDateTime(user.created_at)
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(user)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(user)}
            className="h-8 w-8 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their roles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={users}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearchTerm}
        onSort={handleSort}
        searchPlaceholder="Search users..."
        searchValue={searchTerm}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm 
              user={selectedUser} 
              onSuccess={handleFormSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default UserManagement;