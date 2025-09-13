import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from '../common/StarRating';
import RatingDialog from '../stores/RatingDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import { ratingsAPI } from '@/utils/api';
import LoadingSpinner, { LoadingCard } from '../common/LoadingSpinner';
import { formatDateTime } from '@/lib/utils';
import { PAGINATION } from '@/utils/constants';

const MyRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    loadMyRatings();
  }, [currentPage]);

  const loadMyRatings = async () => {
    setIsLoading(true);
    try {
      const response = await ratingsAPI.getUserRatings({
        page: currentPage,
        size: PAGINATION.DEFAULT_SIZE
      });
      
      setRatings(response.data.data.ratings);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (rating) => {
    setSelectedRating({
      id: rating.store_id,
      name: rating.store_name,
      address: rating.store_address
    });
    setIsEditDialogOpen(true);
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
        loadMyRatings();
      } catch (error) {
        console.error('Error deleting rating:', error);
      }
    }
  };

  const handleRatingSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedRating(null);
    loadMyRatings();
  };

  if (isLoading && ratings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Ratings</h1>
          <p className="text-muted-foreground">Your store ratings and reviews</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Ratings</h1>
        <p className="text-muted-foreground">
          Your store ratings and reviews
        </p>
      </div>

      {ratings.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {ratings.map((rating) => (
              <Card key={rating.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{rating.store_name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rating.store_address}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rating)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rating)}
                        className="h-8 w-8 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Your Rating</p>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={rating.rating} />
                        <span className="text-sm font-medium">
                          {rating.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Rated on {formatDateTime(rating.created_at)}</p>
                      {rating.updated_at !== rating.created_at && (
                        <p>Updated on {formatDateTime(rating.updated_at)}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= pagination.totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-muted-foreground">
            <Star className="w-full h-full opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No ratings yet
          </h3>
          <p className="text-muted-foreground">
            You haven't rated any stores yet. Start exploring and rating stores!
          </p>
        </div>
      )}

      {/* Edit Rating Dialog */}
      {selectedRating && (
        <RatingDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          store={selectedRating}
          currentRating={ratings.find(r => r.store_id === selectedRating.id)?.rating || 0}
          onSuccess={handleRatingSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Rating"
        description={`Are you sure you want to delete your rating for "${selectedRating?.store_name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default MyRatings;