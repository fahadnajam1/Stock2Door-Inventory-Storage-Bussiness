import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthProps {
  onNavigate?: (page: string) => void;
}

export default function Auth({ onNavigate }: AuthProps) {
  const { signIn, signUp } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        const res = (await signUp(email, password)) as { error?: { message?: string } | null } | null;
        if (res?.error) setError(res.error.message ?? 'Signup failed');
        else {
          setShowSuccess(true);
          setEmail('');
          setPassword('');
        }
      } else {
        const res = (await signIn(email, password)) as { error?: { message?: string } | null } | null;
        if (res?.error) setError(res.error.message ?? 'Sign in failed');
        else if (onNavigate) onNavigate('dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err) || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-xl mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">S2D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock2Door</h1>
          <p className="text-gray-600">{isSignup ? 'Create your account' : 'Welcome back'}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Toggle Auth Mode */}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
            }}
            className="w-full px-4 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            {isSignup ? 'Have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By continuing, you agree to our<br />
          <a href="#" className="text-emerald-600 hover:underline font-semibold">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-emerald-600 hover:underline font-semibold">Privacy Policy</a>
        </p>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fadeInUp">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Welcome to Stock2Door!
            </h2>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Your account has been successfully created. You're all set to start managing your orders.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                setIsSignup(false);
              }}
              className="w-full px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
