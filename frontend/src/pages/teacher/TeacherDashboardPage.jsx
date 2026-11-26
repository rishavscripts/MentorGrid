import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Search, Plus, Pencil, Trash2, Send } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import IdBadge from '../../components/common/IdBadge';
import StudentFormModal from '../../components/teacher/StudentFormModal';
import { teacherApi } from '../../api/teacherApi';
import { studentApi } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      const tData = await teacherApi.getMyProfile();
      setTeacher(tData);

      if (tData?.displayId) {
        const [sList, aList] = await Promise.all([
          studentApi.getStudentsByMentor(tData.displayId, searchQuery),
          teacherApi.getAnnouncements(tData.displayId),
        ]);
        setStudents(sList);
        setAnnouncements(aList);
      }
    } catch {
      setError('Unable to load teacher dashboard. Verify backend microservices are running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!message.trim() || !teacher?.displayId) return;
    setPublishing(true);
    try {
      await teacherApi.publishAnnouncement(teacher.displayId, message.trim());
      setMessage('');
      const updated = await teacherApi.getAnnouncements(teacher.displayId);
      setAnnouncements(updated);
    } catch {
      setError('Failed to publish announcement.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveStudent = async (formData, existingDisplayId) => {
    setSavingStudent(true);
    try {
      if (existingDisplayId) {
        await studentApi.updateStudentByTeacher(existingDisplayId, formData);
      } else {
        await studentApi.createStudentByTeacher(formData);
      }
      setModalOpen(false);
      setEditingStudent(null);
      await loadDashboard();
    } catch {
      setError('Failed to save student record.');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm(`Remove ${student.fullName} (${student.displayId}) from your mentee list?`)) return;
    try {
      await studentApi.deleteStudentByTeacher(student.displayId);
      await loadDashboard();
    } catch {
      setError('Failed to delete student record.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {teacher ? `${teacher.fullName} • ${teacher.department}` : 'Faculty Control Center'}
            </h1>
            <p className="text-sm text-slate-500">Manage your assigned student cohort and broadcast updates</p>
          </div>
          <span className="rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-800">
            Total Mentees: {students.length}
          </span>
        </div>

        {/* Announcement Publisher */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="h-4 w-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Publish Announcement to Your Mentees
            </h2>
          </div>

          <form onSubmit={handlePublish} className="space-y-3">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write an update, deadline, or instruction for all students under your mentorship..."
              className="w-full rounded-xl border border-slate-300 p-3.5 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500 truncate max-w-xl">
                {announcements[0] ? `Latest: "${announcements[0].content}"` : 'No announcements published yet.'}
              </p>
              <button
                type="submit"
                disabled={publishing || !message.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition cursor-pointer"
              >
                <Send className="h-4 w-4" /> {publishing ? 'Publishing...' : 'Publish Broadcast'}
              </button>
            </div>
          </form>
        </section>

        {/* Managed Students Board */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Managed Students Board
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name or S_ID..."
                  className="w-64 rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setEditingStudent(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Student
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Full Name</th>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Department / Year</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Loading student records...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No students found under your mentorship yet.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.displayId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-3">
                        <IdBadge id={s.displayId} type="STUDENT" />
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">{s.fullName}</td>
                      <td className="py-3.5 px-3 text-slate-600 font-mono-id text-xs">{s.rollNumber}</td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {s.department} • <span className="text-slate-500">{s.batchYear}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{s.phone}</td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingStudent(s);
                            setModalOpen(true);
                          }}
                          title="Edit Student"
                          className="inline-flex rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s)}
                          title="Delete Student"
                          className="inline-flex rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <StudentFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        initialData={editingStudent}
        mentorDisplayId={teacher?.displayId || user?.displayId}
        saving={savingStudent}
      />
    </div>
  );
}