import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button} from '../../ui/button';
import {Input} from '../../ui/input';
import Icon from '../AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    customer: { email: 'customer@rentflow.com', password: 'customer123' },
    admin: { email: 'admin@rentflow.com', password: 'admin123' }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      const isCustomer = formData?.email === mockCredentials?.customer?.email && 
                        formData?.password === mockCredentials?.customer?.password;
      const isAdmin = formData?.email === mockCredentials?.admin?.email && 
                     formData?.password === mockCredentials?.admin?.password;

      if (isCustomer) {
        // Redirect to customer dashboard
        navigate('/customer-dashboard');
      } else if (isAdmin) {
        // Redirect to admin dashboard (using customer dashboard for now)
        navigate('/customer-dashboard');
      } else {
        // Invalid credentials
        setErrors({
          general: 'Invalid email or password. Try: customer@rentflow.com / customer123 or admin@rentflow.com / admin123'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{errors?.general}</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          error={errors?.email}
          required
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="h-12"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;