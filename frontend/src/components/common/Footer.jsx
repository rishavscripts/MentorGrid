import { Network } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Network className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">MentorGrid</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Distributed student-mentor management powered by Spring Boot Microservices, API Gateway, and PostgreSQL.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/register?role=STUDENT" className="hover:text-white transition">Student Onboarding</Link></li>
              <li><Link to="/register?role=TEACHER" className="hover:text-white transition">Faculty Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Cohort Broadcasts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Microservices</h4>
            <ul className="space-y-2 text-slate-400 font-mono-id text-xs">
              <li>api-gateway (:8080)</li>
              <li>auth-service (:8081)</li>
              <li>student-service (:8082)</li>
              <li>teacher-service (:8083)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Gateway Endpoint</h4>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 font-mono-id">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              {import.meta.env.VITE_API_BASE_URL}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MentorGrid Systems. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Spring Cloud • Eureka • PostgreSQL • React</p>
        </div>
      </div>
    </footer>
  );
}