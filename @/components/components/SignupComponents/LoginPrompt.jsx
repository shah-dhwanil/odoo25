import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from '../../ui/button';

const LoginPrompt = () => {
  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <Link to="/login">
          <Button
            variant="outline"
            className="w-full"
            iconName="LogIn"
            iconPosition="left"
          >
            Sign In to Your Account
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default LoginPrompt;