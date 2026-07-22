import React, { useState } from 'react';
import { LeafIcon } from './icons';
import { apiService } from '../services/apiService';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

type SignupStep = 'mobile' | 'otp' | 'details';

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Form State
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');

  // UI State
  const [signupStep, setSignupStep] = useState<SignupStep>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const DUMMY_OTP = '123456';

  const clearForm = () => {
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setName('');
    setVillage('');
    setDistrict('');
    setSignupStep('mobile');
    setError('');
    setSuccess('');
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    clearForm();
  };

  const validateMobile = (mob: string) => /^\d{10}$/.test(mob);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    
  setIsLoading(true);
  try {
    // Registration will fail if user already exists (handled by backend)
    setSignupStep('otp');
    setSuccess(`A dummy OTP has been sent. Please use: ${DUMMY_OTP}`);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp !== DUMMY_OTP) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSignupStep('details');
    setSuccess('OTP verified. Please enter your details.');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !village.trim() || !district.trim()) {
        setError('Please fill in all details.');
        return;
    }

    setIsLoading(true);
    try {
        await apiService.register(mobile, password, { name, village, district });
        setSuccess('Signup successful! Please log in to continue.');
        setIsLoginView(true);
        clearForm();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateMobile(mobile)) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
    }
    if (!password) {
        setError('Please enter your password.');
        return;
    }
    
    setIsLoading(true);
    try {
        const user = await apiService.login(mobile, password);
        onAuthSuccess(user);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const renderSignupForm = () => {
    if (signupStep === 'details') {
        return (
            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your full name" required />
                </div>
                <div>
                    <label htmlFor="village" className="block text-sm font-medium text-gray-700">Village/Town</label>
                    <input id="village" type="text" value={village} onChange={(e) => setVillage(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your village or town" required />
                </div>
                <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                    <input id="district" type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your district" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-400">
                    {isLoading ? 'Registering...' : 'Complete Signup'}
                </button>
            </form>
        );
    }
    if (signupStep === 'otp') {
        return (
             <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" value={mobile} className="mt-1 block w-full p-3 bg-gray-100 border-gray-300 rounded-md" disabled />
                </div>
                 <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                    <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Enter 6-digit OTP" required />
                </div>
                <div>
                    <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">Create Password</label>
                    <input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Min. 6 characters" required />
                </div>
                <div>
                    <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input id="confirm-password-signup" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Confirm your password" required />
                </div>
                 <button type="submit" className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-md">
                    Verify & Proceed
                </button>
             </form>
        );
    }
    // Default is 'mobile' step
    return (
        <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
                <label htmlFor="mobile-signup" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input id="mobile-signup" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md" placeholder="Enter your 10-digit mobile" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-400">
                {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
        </form>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
      <div className="text-center mb-8">
        <LeafIcon className="h-12 w-12 text-brand-green mx-auto" />
        <h1 className="text-3xl font-bold text-brand-green-dark mt-2">
            SmartHarvest
        </h1>
        <p className="text-gray-500">Your AI Farming Companion</p>
      </div>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm text-center">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm text-center">{success}</p>}

      {isLoginView ? (
        <form onSubmit={handleLogin} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
          <div>
            <label htmlFor="mobile-login" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              id="mobile-login" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green sm:text-sm"
              placeholder="Enter your 10-digit mobile" required
            />
          </div>
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green sm:text-sm"
              placeholder="Enter your password" required
            />
          </div>
          <button
            type="submit" disabled={isLoading}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105 disabled:bg-gray-400"
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      ) : (
        <div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Sign Up</h2>
            {renderSignupForm()}
        </div>
      )}

      <p className="text-center text-sm text-gray-600 mt-8">
        {isLoginView ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={handleToggleView} className="font-semibold text-brand-green hover:underline ml-1">
          {isLoginView ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};
