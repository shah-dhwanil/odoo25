import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleOptions = [
    { 
      value: 'customer', 
      label: 'Customer',
      description: 'Browse and rent products for personal or business use'
    },
    { 
      value: 'admin', 
      label: 'Business Admin',
      description: 'Manage rental inventory, bookings, and business operations'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your account type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score < 2) return { strength: 1, label: 'Weak', color: 'text-red-500' };
    if (score < 4) return { strength: 2, label: 'Fair', color: 'text-yellow-500' };
    if (score < 5) return { strength: 3, label: 'Good', color: 'text-green-500' };
    return { strength: 4, label: 'Strong', color: 'text-green-500' };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration successful:', formData);
      navigate(formData.role === 'admin' ? '/admin-dashboard' : '/customer-dashboard');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* First & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <Label>Email Address</Label>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        
        {formData.password && (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  passwordStrength.strength === 1 ? 'w-1/4 bg-red-500' :
                  passwordStrength.strength === 2 ? 'w-2/4 bg-yellow-500' :
                  passwordStrength.strength === 3 ? 'w-3/4 bg-green-500': 'w-full bg-green-500'
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${passwordStrength.color}`}>
              {passwordStrength.label}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label>Confirm Password</Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2 text-gray-500 hover:text-black"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      {/* Role Selection */}
      <div>
        <Label>Account Type</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleInputChange('role', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your account type" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-sm text-red-500">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Create Account
          </>
        )}
      </Button>
    </form>
  );
};

export default RegistrationForm;
