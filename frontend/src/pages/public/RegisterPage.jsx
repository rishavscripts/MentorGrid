import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Network, GraduationCap, Briefcase } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'TEACHER' ? 'TEACHER' : 'STUDENT';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const authData = await authApi.register({ email, password, role });
      loginUser(authData);
      navigate(role === 'TEACHER' ? '/teacher/profile' : '/student/profile');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Unable to register. Ensure API Gateway (:8080) and Auth Service (:8081) are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Network className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">MentorGrid</span>
          </Link>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500">Select your portal role to begin</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`flex flex-col items-start rounded-xl border-2 p-3.5 text-left transition cursor-pointer ${
              role === 'STUDENT'
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <GraduationCap className={`h-5 w-5 ${role === 'STUDENT' ? 'text-indigo-600' : 'text-slate-500'}`} />
            <span className="mt-2 text-sm font-bold text-slate-900">Student</span>
            <span className="text-xs text-slate-500 font-mono-id">Generates S_ ID</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('TEACHER')}
            className={`flex flex-col items-start rounded-xl border-2 p-3.5 text-left transition cursor-pointer ${
              role === 'TEACHER'
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Briefcase className={`h-5 w-5 ${role === 'TEACHER' ? 'text-indigo-600' : 'text-slate-500'}`} />
            <span className="mt-2 text-sm font-bold text-slate-900">Teacher / Mentor</span>
            <span className="text-xs text-slate-500 font-mono-id">Generates T_ ID</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Create Account & Continue'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}