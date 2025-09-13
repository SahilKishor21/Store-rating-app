import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Filter, Store, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StarRating from '../common/StarRating';
import RatingDialog from './RatingDialog';
import useStoreStore from '@/stores/storeStore';
import useAuthStore from '@/stores/authStore';
import { formatRating } from '@/lib/utils';
import { PAGINATION, SORT_OPTIONS } from '@/utils/constants';
import LoadingSpinner, { LoadingCard } from '../common/LoadingSpinner';

const StoreCard = ({ store, onRate, userRating }) => {
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

  const handleRateSuccess = () => {
    setIsRatingDialogOpen(false);
    if (onRate) onRate();
  };

  const gradientClasses = [
    'bg-gradient-blue',
    'bg-gradient-purple',
    'bg-gradient-green',
    'bg-gradient-orange',
    'bg-gradient-pink',
    'bg-gradient-teal'
  ];

  const gradientClass = gradientClasses[store.id % gradientClasses.length];

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden group">
      {/* Gradient Header */}
      <div className={`${gradientClass} p-4 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
          <Store className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <CardTitle className="text-lg font-bold text-white mb-2">{store.name}</CardTitle>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{store.address}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 bg-white dark:bg-gray-900">
        <div className="space-y-4">
          {/* Rating Display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">
                  {store.average_rating ? formatRating(store.average_rating) : 'N/A'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {store.total_ratings || 0} ratings
                </Badge>
              </div>
              <StarRating rating={store.average_rating || 0} size="sm" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </div>
            </div>
          </div>

          {/* User Rating */}
          {userRating && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Your Rating</p>
              <StarRating rating={userRating} size="sm" />
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200"
            onClick={() => setIsRatingDialogOpen(true)}
          >
            {userRating ? 'Update Rating' : 'Rate Store'}
          </Button>
        </div>

        <RatingDialog
          open={isRatingDialogOpen}
          onOpenChange={setIsRatingDialogOpen}
          store={store}
          currentRating={userRating}
          onSuccess={handleRateSuccess}
        />
      </CardContent>
    </Card>
  );
};

const StoreList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);
  const [sortBy, setSortBy] = useState('created_at:DESC');

  const { user } = useAuthStore();
  const { 
    stores, 
    isLoading, 
    pagination, 
    userRatings,
    fetchStores 
  } = useStoreStore();

  useEffect(() => {
    loadStores();
  }, [currentPage, pageSize, searchTerm, sortBy]);

  const loadStores = () => {
    const params = {
      page: currentPage,
      size: pageSize,
      search: searchTerm,
      sort: sortBy
    };
    fetchStores(params);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && stores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Discover Stores</h1>
              <p className="text-muted-foreground">Find and rate amazing stores</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover Stores
            </h1>
            <p className="text-muted-foreground mt-2">
              Find and rate amazing stores in your area
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            <Users className="w-3 h-3 mr-1" />
            {stores.length} stores
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search stores by name or address..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-11 bg-white dark:bg-gray-800 border-0 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-0 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.STORES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              userRating={userRatings[store.id] || store.user_rating}
              onRate={loadStores}
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.currentPage * pagination.itemsPerPage + 1} to{' '}
              {Math.min(
                (pagination.currentPage + 1) * pagination.itemsPerPage,
                pagination.totalItems
              )}{' '}
              of {pagination.totalItems} stores
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0 || isLoading}
                className="bg-white dark:bg-gray-800"
              >
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
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-8 h-8 p-0 ${
                        pageNumber === pagination.currentPage 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      {pageNumber + 1}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1 || isLoading}
                className="bg-white dark:bg-gray-800"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && stores.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">
              No stores found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm 
                ? `No stores match your search for "${searchTerm}". Try adjusting your search terms.`
                : "There are no stores available at the moment. Check back later for new additions!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreList;