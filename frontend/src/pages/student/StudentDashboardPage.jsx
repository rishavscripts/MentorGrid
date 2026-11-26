import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Megaphone, UserCheck, User, Pencil } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import IdBadge from '../../components/common/IdBadge';
import { studentApi } from '../../api/studentApi';
import { teacherApi } from '../../api/teacherApi';

export default function StudentDashboardPage() {
  const [student, setStudent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const sData = await studentApi.getMyProfile();
        setStudent(sData);

        if (sData?.mentorDisplayId) {
          const [mData, posts] = await Promise.all([
            teacherApi.getByDisplayId(sData.mentorDisplayId),
            teacherApi.getAnnouncements(sData.mentorDisplayId),
          ]);
          setMentor(mData);
          setAnnouncements(posts);
        }
      } catch (err) {
        setError('Unable to load dashboard data. Verify backend services are running.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {loading && <p className="text-sm text-slate-500">Loading your student workspace...</p>}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && student && (
          <>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, {student.fullName}</h1>
              <p className="text-sm text-slate-500">Student Portal • Academic Mentorship Overview</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <User className="h-4 w-4 text-sky-600" /> My Student Profile
                    </span>
                    <IdBadge id={student.displayId} type="STUDENT" />
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Department:</dt>
                      <dd className="font-medium text-slate-900">{student.department}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Roll Number:</dt>
                      <dd className="font-medium text-slate-900">{student.rollNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Batch / Year:</dt>
                      <dd className="font-medium text-slate-900">{student.batchYear}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Phone:</dt>
                      <dd className="font-medium text-slate-900">{student.phone}</dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    to="/student/profile"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Details
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <UserCheck className="h-4 w-4 text-teal-600" /> Assigned Mentor
                  </span>
                  {mentor && <IdBadge id={mentor.displayId} type="TEACHER" />}
                </div>

                {mentor ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-lg font-bold text-slate-900">{mentor.fullName}</p>
                    <p className="text-xs font-medium text-teal-700">
                      {mentor.designation} • {mentor.department}
                    </p>
                    <div className="pt-3 space-y-1.5 text-slate-600">
                      <p><span className="text-slate-400">Cabin:</span> {mentor.cabin || '—'}</p>
                      <p><span className="text-slate-400">Email:</span> {mentor.email}</p>
                      <p><span className="text-slate-400">Phone:</span> {mentor.phone}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No mentor assigned yet.</p>
                )}
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Mentor Announcements {mentor ? `(From ${mentor.fullName})` : ''}
                </h2>
              </div>

              {announcements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  No announcements posted by your mentor yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}