import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Button} from '../../ui/button';
import Icon from '../AppIcon';

const LoginFooter = () => {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="space-y-6">
      {/* Forgot Password */}
      <div className="text-center">
        <Button
          variant="link"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
        >
          Forgot your password?
        </Button>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          New to RentFlow?{' '}
          <Button
            variant="link"
            onClick={handleRegister}
            className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
          >
            Create an account
          </Button>
        </p>
      </div>

      {/* Trust Signals */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} className="text-success" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Lock" size={14} className="text-success" />
          <span>256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default LoginFooter;