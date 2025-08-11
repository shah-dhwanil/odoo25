import React from 'react';
import WelcomeHeader from '../../@/components/components/SignupComponents/WelcomeHeader';
import RegistrationForm from '../../@/components/components/SignupComponents/RegistrationForm';
import LoginPrompt from '../../@/components/components/SignupComponents/LoginPrompt';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Registration Card */}
          <div className="bg-card border border-border rounded-2xl shadow-elevated p-6 sm:p-8">
            {/* Welcome Header */}
            <WelcomeHeader />

            {/* Registration Form */}
            <RegistrationForm />

            {/* Login Prompt */}
            <div className="mt-8">
              <LoginPrompt />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} RentFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;