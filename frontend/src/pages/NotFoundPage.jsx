import { Link } from 'react-router';
import { Lock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { user } = useAuth();
  const homePath = !user
    ? '/'
    : user.role === 'TEACHER'
    ? '/teacher/dashboard'
    : '/student/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">403 — Access Restricted</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your account role does not have permission to view this workspace, or the page does not exist.
          </p>
          <Link
            to={homePath}
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Return to My Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}