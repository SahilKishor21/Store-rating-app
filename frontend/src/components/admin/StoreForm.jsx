import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useStoreStore from '@/stores/storeStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { isValidEmail } from '@/lib/utils';
import { VALIDATION } from '@/utils/constants';

const StoreForm = ({ store = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const { isLoading, createStore, updateStore } = useStoreStore();

  const isEditing = Boolean(store);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        email: store.email || '',
        address: store.address || ''
      });
    }
  }, [store]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Store name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Store name must not exceed 100 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > VALIDATION.ADDRESS.MAX_LENGTH) {
      newErrors.address = `Address must not exceed ${VALIDATION.ADDRESS.MAX_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = isEditing 
      ? await updateStore(store.id, formData)
      : await createStore(formData);
    
    if (result.success) {
      onSuccess();
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800  p-6">
      <div className="space-y-2 bg-muted/50">
        <Label htmlFor="name">Store Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter store name"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter store email"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Enter store address"
          value={formData.address}
          onChange={handleInputChange}
          className={`min-h-[80px] resize-none ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-sm text-red-800 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Store' : 'Create Store'
          )}
        </Button>
      </div>
    </form>
  );
};

export default StoreForm;