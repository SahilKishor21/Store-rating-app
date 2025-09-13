import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useUserStore from '@/stores/userStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { isValidEmail, isValidPassword } from '@/lib/utils';
import { USER_ROLES, ROLE_LABELS, VALIDATION } from '@/utils/constants';

const UserForm = ({ user = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: USER_ROLES.USER
  });
  const [errors, setErrors] = useState({});
  const { isLoading, createUser, updateUser } = useUserStore();

  const isEditing = Boolean(user);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        address: user.address || '',
        role: user.role || USER_ROLES.USER
      });
    }
  }, [user]);

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

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
    
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < VALIDATION.NAME.MIN_LENGTH) {
      newErrors.name = `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`;
    } else if (formData.name.length > VALIDATION.NAME.MAX_LENGTH) {
      newErrors.name = `Name must not exceed ${VALIDATION.NAME.MAX_LENGTH} characters`;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only required for new users)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        const passwordValidation = isValidPassword(formData.password);
        if (!passwordValidation.isValid) {
          const errorMessages = [];
          if (passwordValidation.errors.minLength) errorMessages.push('at least 8 characters');
          if (passwordValidation.errors.maxLength) errorMessages.push('no more than 16 characters');
          if (passwordValidation.errors.hasUppercase) errorMessages.push('one uppercase letter');
          if (passwordValidation.errors.hasSpecialChar) errorMessages.push('one special character');
          
          newErrors.password = `Password must contain ${errorMessages.join(', ')}`;
        }
      }
    }

    // Address validation
    if (formData.address && formData.address.length > VALIDATION.ADDRESS.MAX_LENGTH) {
      newErrors.address = `Address must not exceed ${VALIDATION.ADDRESS.MAX_LENGTH} characters`;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = { ...formData };
    if (isEditing && !submitData.password) {
      delete submitData.password;
    }

    const result = isEditing 
      ? await updateUser(user.id, submitData)
      : await createUser(submitData);
    
    if (result.success) {
      onSuccess();
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800  p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter full name"
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
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password {isEditing && <span className="text-sm text-muted-foreground">(leave blank to keep current)</span>}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={isEditing ? "Enter new password" : "Enter password"}
          value={formData.password}
          onChange={handleInputChange}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Enter address (optional)"
          value={formData.address}
          onChange={handleInputChange}
          className={`min-h-[80px] resize-none ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role} onValueChange={handleSelectChange}>
          <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role}</p>
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
            isEditing ? 'Update User' : 'Create User'
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;