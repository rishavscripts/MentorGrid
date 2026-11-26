import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../components/common/Navbar';
import { teacherApi } from '../../api/teacherApi';
import { useAuth } from '../../context/AuthContext';

export default function TeacherProfilePage() {
  const { user, updateUserSession } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    department: '',
    designation: '',
    cabin: '',
    phone: '',
    email: user?.email || '',
  });

  useEffect(() => {
    async function loadExisting() {
      if (user?.profileCompleted) {
        try {
          const existing = await teacherApi.getMyProfile();
          if (existing) setForm(existing);
        } catch {
          setError('Unable to load existing faculty profile.');
        }
      }
    }
    loadExisting();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const saved = await teacherApi.saveProfile(form);
      updateUserSession({ displayId: saved.displayId, profileCompleted: true });
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save teacher profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">Faculty Mentor Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Once saved, students can select your <code className="font-mono-id text-xs">T_ID</code> during onboarding.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (with Title) *</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g., Dr. Arindam Sen"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                <input
                  required
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g., Computer Science (CSE)"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation *</label>
                <input
                  required
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g., Associate Professor"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cabin / Office Room</label>
                <input
                  value={form.cabin}
                  onChange={(e) => setForm({ ...form, cabin: e.target.value })}
                  placeholder="e.g., Block B, Room 204"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {user?.profileCompleted && (
                <button
                  type="button"
                  onClick={() => navigate('/teacher/dashboard')}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Saving...' : user?.displayId ? 'Update Faculty Profile' : 'Save & Generate Teacher ID'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}