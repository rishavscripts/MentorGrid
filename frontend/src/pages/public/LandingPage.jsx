import { Link } from 'react-router';
import { GraduationCap, Briefcase, CheckCircle2, ArrowRight, Server } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <section id="features" className="relative overflow-hidden py-20 sm:py-28">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="mesh-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                <circle cx="0" cy="0" r="2.5" fill="#4F46E5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh-grid)" />
          </svg>

          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 font-mono-id shadow-xs">
                ● Student Node: S_xxxxxxxx
              </span>
              <span className="text-slate-400 text-xs font-mono-id">⇄ API Gateway (:8080) ⇄</span>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 font-mono-id shadow-xs">
                ● Mentor Node: T_xxxxxxxx
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Structured Mentorship.
              <span className="block text-indigo-600">Zero Spreadsheet Chaos.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
              Connect students and faculty mentors through dedicated portals, auto-generated unique system IDs, and instant cohort announcements.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register?role=STUDENT"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
              >
                Create Student Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register?role=TEACHER"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
              >
                Join as Faculty Mentor
              </Link>
            </div>
          </div>
        </section>

        <section id="portals" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-700 font-mono-id">
                  FOR STUDENTS (S_xxxxxxxx)
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Student Workspace</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  Auto-generated 8-character unique Student ID (<code className="font-mono-id text-xs">S_xxxxxxxx</code>)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  Select your assigned faculty mentor during onboarding
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  Receive live announcements published by your mentor
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-teal-50 border border-teal-200 px-2.5 py-1 text-xs font-semibold text-teal-700 font-mono-id">
                  FOR TEACHERS (T_xxxxxxxx)
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">Faculty Control Board</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  Unified student table displaying all assigned mentees
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  Add, edit, delete, and search students by Name or <code className="font-mono-id text-xs">S_ID</code>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  Publish instant announcements straight to student dashboards
                </li>
              </ul>
            </div>
          </div>

          <div
            id="architecture"
            className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900">Spring Boot Microservices Architecture</p>
                <p className="text-xs text-slate-500">
                  Isolated Auth, Student, and Teacher services orchestrated behind Spring Cloud API Gateway & Eureka.
                </p>
              </div>
            </div>
            <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 shrink-0">
              Launch Portal →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}