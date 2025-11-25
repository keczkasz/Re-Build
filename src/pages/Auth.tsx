import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recycle } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  confirmPassword: z.string(),
  userType: z.string().min(1, 'Please select a user type'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Mode: login, signup, forgot, reset
  const mode = searchParams.get('mode');
  const [showForgotPassword, setShowForgotPassword] = useState(mode === 'forgot');
  const [showResetPassword, setShowResetPassword] = useState(mode === 'reset');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<any>({});
  
  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('');
  const [signupErrors, setSignupErrors] = useState<any>({});
  
  // Password recovery
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetErrors, setResetErrors] = useState<any>({});

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
      setLoading(true);
      const { error } = await signIn(loginEmail, loginPassword);
      if (!error) {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setLoginErrors(errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    
    try {
      signupSchema.parse({ 
        email: signupEmail, 
        password: signupPassword,
        confirmPassword,
        fullName,
        userType
      });
      setLoading(true);
      const { error } = await signUp(signupEmail, signupPassword, fullName, userType);
      if (!error) {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setSignupErrors(errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrors({});
    
    try {
      z.string().email().parse(resetEmail);
      setLoading(true);
      await resetPassword(resetEmail);
      setShowForgotPassword(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setResetErrors({ email: 'Invalid email address' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrors({});
    
    try {
      if (newPassword.length < 6) {
        setResetErrors({ password: 'Password must be at least 6 characters' });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setResetErrors({ confirmPassword: "Passwords don't match" });
        return;
      }
      setLoading(true);
      const { error } = await updatePassword(newPassword);
      if (!error) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Recycle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Re:Build</span>
            </div>
            <p className="text-muted-foreground">Enter your new password</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {resetErrors.password && (
                <p className="text-sm text-destructive">{resetErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              {resetErrors.confirmPassword && (
                <p className="text-sm text-destructive">{resetErrors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Recycle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Re:Build</span>
            </div>
            <p className="text-muted-foreground">Reset your password</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              {resetErrors.email && (
                <p className="text-sm text-destructive">{resetErrors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Recycle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Re:Build</span>
          </div>
          <p className="text-muted-foreground">
            Join the circular economy in construction
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                {loginErrors.email && (
                  <p className="text-sm text-destructive">{loginErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                {loginErrors.password && (
                  <p className="text-sm text-destructive">{loginErrors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                {signupErrors.fullName && (
                  <p className="text-sm text-destructive">{signupErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                {signupErrors.email && (
                  <p className="text-sm text-destructive">{signupErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-type">I am a...</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger id="user-type">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demolition_contractor">Demolition Contractor</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="recycler">Recycler</SelectItem>
                    <SelectItem value="architect">Architect</SelectItem>
                    <SelectItem value="local_authority">Local Authority</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="private_client">Private Client</SelectItem>
                  </SelectContent>
                </Select>
                {signupErrors.userType && (
                  <p className="text-sm text-destructive">{signupErrors.userType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                {signupErrors.password && (
                  <p className="text-sm text-destructive">{signupErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {signupErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{signupErrors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
