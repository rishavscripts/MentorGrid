import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../components/common/Navbar';
import { teacherApi } from '../../api/teacherApi';
import { studentApi } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfilePage() {
  const { user, updateUserSession } = useAuth();
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    department: '',
    rollNumber: '',
    batchYear: '',
    phone: '',
    email: user?.email || '',
    mentorDisplayId: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const mentorList = await teacherApi.getAllMentors();
        setMentors(mentorList);

        if (user?.profileCompleted) {
          const existing = await studentApi.getMyProfile();
          if (existing) setForm(existing);
        } else if (mentorList.length > 0) {
          setForm((prev) => ({ ...prev, mentorDisplayId: mentorList[0].displayId }));
        }
      } catch (err) {
        setError('Unable to load mentor directory from Teacher Service.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const saved = await studentApi.saveMyProfile(form);
      updateUserSession({ displayId: saved.displayId, profileCompleted: true });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save student profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Student Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in your academic details and select your assigned faculty mentor.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading profile & available mentors...</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Enter your full name"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University Roll Number *</label>
                  <input
                    required
                    value={form.rollNumber}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                    placeholder="University roll number"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Semester *</label>
                  <input
                    required
                    value={form.batchYear}
                    onChange={(e) => setForm({ ...form, batchYear: e.target.value })}
                    placeholder="e.g., 4th Year / Sem 7"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <label className="block text-xs font-bold uppercase tracking-wide text-indigo-900 mb-1.5">
                  Select Your Faculty Mentor *
                </label>
                {mentors.length === 0 ? (
                  <p className="text-xs text-amber-700">
                    No faculty mentors registered yet. Ask a teacher to complete their profile first.
                  </p>
                ) : (
                  <select
                    required
                    value={form.mentorDisplayId}
                    onChange={(e) => setForm({ ...form, mentorDisplayId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Choose Faculty Mentor --
                    </option>
                    {mentors.map((m) => (
                      <option key={m.displayId} value={m.displayId}>
                        {m.fullName} — {m.department} ({m.displayId})
                      </option>
                    ))}
                  </select>
                )}
                <p className="mt-1.5 text-xs text-slate-600">
                  Your profile will immediately appear on this mentor&apos;s control board.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {user?.profileCompleted && (
                  <button
                    type="button"
                    onClick={() => navigate('/student/dashboard')}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || mentors.length === 0}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Saving...' : user?.displayId ? 'Update Student Profile' : 'Save & Generate Student ID'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}