import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, Mail, ChevronRight } from 'lucide-react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'; 

// Constants
const MIN_PASSWORD_LENGTH = 8;
const LOGIN_ATTEMPT_LIMIT = 5;
const LOCKOUT_DURATION = 15; // minutes

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Password strength checks
  const passwordChecks = {
    length: password.length >= MIN_PASSWORD_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  // Check for stored credentials and lockout on component mount
  useEffect(() => {
    // Check for lockout
    const storedLockout = localStorage.getItem('adminLockoutUntil');
    if (storedLockout) {
      const lockoutTime = new Date(storedLockout);
      if (new Date() < lockoutTime) {
        setLockoutUntil(lockoutTime);
      } else {
        localStorage.removeItem('adminLockoutUntil');
        localStorage.removeItem('adminLoginAttempts');
      }
    }
    
    // Check for stored attempts
    const storedAttempts = localStorage.getItem('adminLoginAttempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
    
    // Check for remembered email
    const storedEmail = localStorage.getItem('adminEmail');
    const storedRemember = localStorage.getItem('adminRemember');
    
    if (storedEmail && storedRemember === 'true') {
      setEmail(storedEmail);
      setRememberMe(true);
    }
    
    // Focus on email field on load if not remembered
    if (!storedEmail && emailInputRef.current) {
      emailInputRef.current.focus();
    }
    
    // Check if redirected with a message
    if (router.query.sessionExpired) {
      setError('Your session has expired. Please sign in again.');
    }
    
    if (router.query.accountCreated) {
      setSuccess('Your account has been created. You can now sign in.');
    }
  }, [router.query]);

  // Validate email format
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    if (!isEmailValid(email)) {
      return false;
    }
    return password.length >= MIN_PASSWORD_LENGTH;
  };

  // Reset error when inputs change
  useEffect(() => {
    if (formSubmitted && (email || password)) {
      setError(null);
    }
  }, [email, password, formSubmitted]);

  // Calculate remaining lockout time in minutes
  const getRemainingLockoutTime = (): number => {
    if (!lockoutUntil) return 0;
    const remaining = Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / 60000);
    return remaining > 0 ? remaining : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Check if account is locked out
    if (lockoutUntil && new Date() < lockoutUntil) {
      const minutesLeft = getRemainingLockoutTime();
      setError(`Too many failed login attempts. Please try again in ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'}.`);
      return;
    }
    
    // Validate form
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials (replace with actual API call)
      if (email === 'admin@example.com' && password === 'Admin123!') {
        // Successful login
        handleSuccessfulLogin('demo-jwt-token-would-be-from-api');
      } else {
        // Failed login
        handleFailedLogin();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while trying to sign in. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful login
  const handleSuccessfulLogin = (token: string) => {
    // Reset login attempts
    setLoginAttempts(0);
    localStorage.removeItem('adminLoginAttempts');
    localStorage.removeItem('adminLockoutUntil');
    
    // Set success message briefly
    setSuccess('Login successful! Redirecting...');
    
    // Handle "Remember me" functionality
    if (rememberMe) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminRemember', 'true');
    } else {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminRemember');
    }
    
    // Set auth token in a secure HTTP-only cookie (in production)
    // For demo, we'll store in localStorage
    localStorage.setItem('adminToken', token);
    
    // In production, use secure cookies like this:
    /*
    setCookie(null, 'adminAuth', token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    });
    */
    
    // Redirect after a short delay to show success message
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1000);
  };

  // Handle failed login attempt
  const handleFailedLogin = () => {
    // Increment login attempts
    const newAttemptCount = loginAttempts + 1;
    setLoginAttempts(newAttemptCount);
    localStorage.setItem('adminLoginAttempts', newAttemptCount.toString());
    
    // Check if account should be locked
    if (newAttemptCount >= LOGIN_ATTEMPT_LIMIT) {
      const lockoutTime = new Date();
      lockoutTime.setMinutes(lockoutTime.getMinutes() + LOCKOUT_DURATION);
      setLockoutUntil(lockoutTime);
      localStorage.setItem('adminLockoutUntil', lockoutTime.toString());
      
      setError(`Too many failed login attempts. Your account has been locked for ${LOCKOUT_DURATION} minutes.`);
    } else {
      const attemptsLeft = LOGIN_ATTEMPT_LIMIT - newAttemptCount;
      setError(`Invalid email or password. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining before lockout.`);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | Medical Center</title>
        <meta name="description" content="Secure admin login for the medical center management system" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="inline-block relative h-20 w-20 mb-5 rounded-full bg-white p-2 shadow-md">
              <Image
                src="/images/image.png"
                alt="Medical Center Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Portal</h1>
            <p className="mt-2 text-sm text-gray-600">
              Secure access to the website management system
            </p>
          </div>
          
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
              
              {/* Success message */}
              {success && (
                <div className="mb-6 p-4 rounded-md bg-green-50 text-sm text-green-700 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <p>{success}</p>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 text-sm text-red-700 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  <p>{error}</p>
                </div>
              )}
              
              {/* Lockout warning */}
              {lockoutUntil && new Date() < lockoutUntil && (
                <div className="mb-6 p-4 rounded-md bg-yellow-50 text-sm text-yellow-700 border border-yellow-200">
                  <h3 className="font-medium mb-1">Account Temporarily Locked</h3>
                  <p>For your security, login has been disabled temporarily due to multiple failed attempts.</p>
                  <p className="mt-2">Please try again in {getRemainingLockoutTime()} {getRemainingLockoutTime() === 1 ? 'minute' : 'minutes'}.</p>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      ref={emailInputRef}
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || (lockoutUntil && new Date() < lockoutUntil)}
                      className={`pl-10 block w-full shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                        formSubmitted && !isEmailValid(email) ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="admin@example.com"
                    />
                    {formSubmitted && email && !isEmailValid(email) && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {formSubmitted && email && !isEmailValid(email) && (
                    <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
                  )}
                </div>
                
                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      disabled={isLoading || (lockoutUntil && new Date() < lockoutUntil)}
                      className={`pl-10 block w-full shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                        formSubmitted && password.length < MIN_PASSWORD_LENGTH ? 'border-red-300' : ''
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password strength meter (shows only when password field is focused) */}
                  {(passwordFocused || (formSubmitted && password.length > 0)) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Password must have:</p>
                      <ul className="space-y-1">
                        <li className={`text-xs flex items-center ${passwordChecks.length ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle size={12} className={`mr-1 ${passwordChecks.length ? 'text-green-500' : 'text-gray-400'}`} />
                          At least {MIN_PASSWORD_LENGTH} characters
                        </li>
                        <li className={`text-xs flex items-center ${passwordChecks.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle size={12} className={`mr-1 ${passwordChecks.hasUppercase ? 'text-green-500' : 'text-gray-400'}`} />
                          At least one uppercase letter
                        </li>
                        <li className={`text-xs flex items-center ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle size={12} className={`mr-1 ${passwordChecks.hasNumber ? 'text-green-500' : 'text-gray-400'}`} />
                          At least one number
                        </li>
                        <li className={`text-xs flex items-center ${passwordChecks.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                          <CheckCircle size={12} className={`mr-1 ${passwordChecks.hasSpecial ? 'text-green-500' : 'text-gray-400'}`} />
                          At least one special character
                        </li>
                      </ul>
                      
                      {password.length > 0 && (
                        <div className="mt-2">
                          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                passwordStrength <= 2 ? 'bg-red-500' : 
                                passwordStrength <= 3 ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(100, (passwordStrength / 5) * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 text-gray-500">
                            Password strength: {
                              passwordStrength <= 2 ? 'Weak' : 
                              passwordStrength <= 3 ? 'Medium' : 
                              'Strong'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Remember me and forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading || (lockoutUntil && new Date() < lockoutUntil)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link href="/admin/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                
                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || (lockoutUntil && new Date() < lockoutUntil) || !email || !password}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ChevronRight className="ml-2 -mr-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
                
                {/* Demo credentials hint */}
                <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800 border border-blue-100">
                  <p className="font-medium mb-1">Demo Credentials:</p>
                  <p>Email: admin@example.com</p>
                  <p>Password: Admin123!</p>
                </div>
              </form>
            </div>
            
            {/* Back to website link */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to website
              </Link>
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Medical Center. All rights reserved.</p>
              <div className="mt-1 flex justify-center space-x-3">
                <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                  Privacy
                </Link>
                <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-500">
                  Terms
                </Link>
                <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}