import React, { useState, useEffect } from 'react';
import { Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import ConfirmDialog from '../common/ConfirmDialog';
import StarRating from '../common/StarRating';
import { ratingsAPI } from '@/utils/api';
import { formatDateTime } from '@/lib/utils';
import { PAGINATION } from '@/utils/constants';

const RatingsManagement = () => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    loadRatings();
  }, [currentPage, pageSize, sortField, sortOrder, ratingFilter]);

  const loadRatings = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sort: `${sortField}:${sortOrder}`
      };

      const response = await ratingsAPI.getAll(params);
      setRatings(response.data.data.ratings);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (rating) => {
    setSelectedRating(rating);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRating) {
      try {
        await ratingsAPI.delete(selectedRating.id);
        setIsDeleteDialogOpen(false);
        setSelectedRating(null);
        loadRatings();
      } catch (error) {
        console.error('Error deleting rating:', error);
      }
    }
  };

  const handleSort = (sort) => {
    const [field, order] = sort.split(':');
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(0);
  };

  const getRatingBadgeColor = (rating) => {
    if (rating >= 4) return 'default';
    if (rating >= 3) return 'secondary';
    if (rating >= 2) return 'outline';
    return 'destructive';
  };

 const filteredRatings = ratingFilter && ratingFilter !== 'all' 
  ? ratings.filter(rating => rating.rating === parseInt(ratingFilter))
  : ratings;

  const columns = [
    {
      accessorKey: 'store_name',
      header: 'Store',
      sortable: true,
      cell: (rating) => (
        <div>
          <div className="font-medium">{rating.store_name}</div>
          <div className="text-sm text-muted-foreground">ID: {rating.store_id}</div>
        </div>
      )
    },
    {
      accessorKey: 'user_name',
      header: 'User',
      sortable: true,
      cell: (rating) => (
        <div>
          <div className="font-medium">{rating.user_name}</div>
          <div className="text-sm text-muted-foreground">{rating.user_email}</div>
        </div>
      )
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      sortable: true,
      cell: (rating) => (
        <div className="flex items-center space-x-2">
          <StarRating rating={rating.rating} size="sm" />
          <Badge variant={getRatingBadgeColor(rating.rating)}>
            {rating.rating}/5
          </Badge>
        </div>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      sortable: true,
      cell: (rating) => (
        <div>
          <div>{formatDateTime(rating.created_at)}</div>
          {rating.updated_at !== rating.created_at && (
            <div className="text-xs text-muted-foreground">
              Updated: {formatDateTime(rating.updated_at)}
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (rating) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(rating)}
          className="h-8 w-8 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ratings Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all ratings on the platform
          </p>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium">Filter by rating:</label>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
  <SelectItem value="all">All Ratings</SelectItem>
  <SelectItem value="5">5 Stars</SelectItem>
  <SelectItem value="4">4 Stars</SelectItem>
  <SelectItem value="3">3 Stars</SelectItem>
  <SelectItem value="2">2 Stars</SelectItem>
  <SelectItem value="1">1 Star</SelectItem>
</SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratings.filter(r => r.rating === star).length;
          const percentage = ratings.length > 0 ? (count / ratings.length * 100).toFixed(1) : 0;
          
          return (
            <div key={star} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{star}</span>
                  <StarRating rating={star} size="sm" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DataTable
        data={filteredRatings}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Rating"
        description={`Are you sure you want to delete this rating by ${selectedRating?.user_name} for ${selectedRating?.store_name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default RatingsManagement;