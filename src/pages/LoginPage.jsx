import LoginHeader from '../../@/components/components/LoginComponents/LoginHeader';
import LoginForm from '../../@/components/components/LoginComponents/LoginForm';
import SocialLogin from '../../@/components/components/LoginComponents/SocialLogin';
import LoginFooter from '../../@/components/components/LoginComponents/LoginFooter';
import DemoCredentials from '../../@/components/components/LoginComponents/DemoCredentials';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-modal p-8">
          {/* Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm />

          {/* Social Login */}
          <div className="mt-6">
            <SocialLogin />
          </div>

          {/* Footer Links */}
          <div className="mt-8">
            <LoginFooter />
          </div>
        </div>

        {/* Demo Credentials */}
        <DemoCredentials />

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} RentFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;