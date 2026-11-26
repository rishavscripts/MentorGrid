import { Link, NavLink, useNavigate } from 'react-router';
import { Network, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import IdBadge from './IdBadge';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Network className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">MentorGrid</span>
          </Link>

          {!user && (
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Features
              </a>
              <a href="#architecture" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Architecture
              </a>
              <a href="#portals" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Portals
              </a>
            </nav>
          )}

          {user?.role === 'STUDENT' && (
            <nav className="hidden sm:flex items-center gap-6">
              <NavLink to="/student/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/student/profile" className={navLinkClass}>
                Edit Profile
              </NavLink>
            </nav>
          )}

          {user?.role === 'TEACHER' && (
            <nav className="hidden sm:flex items-center gap-6">
              <NavLink to="/teacher/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/teacher/profile" className={navLinkClass}>
                Profile
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span
                className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.role === 'TEACHER'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {user.role}
              </span>
              <IdBadge id={user.displayId} type={user.role} />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}