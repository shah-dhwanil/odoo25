import React from 'react';
import Icon from '../AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-elevated">
          <Icon name="Package" size={32} className="text-primary-foreground" />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Join RentFlow
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Create your account to start renting products or manage your rental business with our comprehensive platform.
        </p>
      </div>

      {/* Features Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs sm:text-sm">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Shield" size={16} className="text-success" />
          <span>Secure Platform</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Clock" size={16} className="text-primary" />
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Zap" size={16} className="text-warning" />
          <span>Instant Setup</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;