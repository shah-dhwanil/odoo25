import React from 'react';
import Icon from '../AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-elevated">
          <Icon name="Package" size={32} className="text-primary-foreground" />
        </div>
      </div>

      {/* Brand Name */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">RentFlow</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Streamline your rental business
        </p>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;