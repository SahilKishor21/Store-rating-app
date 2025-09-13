import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DataTable from '../common/DataTable';
import StoreForm from './StoreForm';
import ConfirmDialog from '../common/ConfirmDialog';
import useStoreStore from '@/stores/storeStore';
import StarRating from '../common/StarRating';
import { formatDateTime } from '@/lib/utils';

const StoreManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const { stores, isLoading, pagination, fetchStores, deleteStore } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Store Name',
      sortable: true,
      cell: (store) => (
        <div>
          <div className="font-medium">{store.name}</div>
          <div className="text-sm text-muted-foreground">{store.email}</div>
        </div>
      )
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: (store) => (
        <div className="max-w-xs truncate" title={store.address}>
          {store.address}
        </div>
      )
    },
    {
      accessorKey: 'average_rating',
      header: 'Rating',
      sortable: true,
      cell: (store) => (
        <div className="flex items-center space-x-2">
          <StarRating rating={store.average_rating || 0} size="sm" />
          <span className="text-sm">({store.total_ratings || 0})</span>
        </div>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      sortable: true,
      cell: (store) => formatDateTime(store.created_at)
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (store) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(store)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(store)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleEdit = (store) => {
    setSelectedStore(store);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground">Manage stores on the platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
            </DialogHeader>
            <StoreForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={stores}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
      />
    </div>
  );
};

export default StoreManagement;