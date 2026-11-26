import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function IdBadge({ id, type = 'STUDENT' }) {
  const [copied, setCopied] = useState(false);

  const isTeacher = type === 'TEACHER' || (id && id.startsWith('T_'));
  const badgeClasses = !id
    ? 'bg-slate-100 text-slate-600 border-slate-200'
    : isTeacher
    ? 'bg-teal-50 text-teal-700 border-teal-200'
    : 'bg-sky-50 text-sky-700 border-sky-200';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span
      onClick={handleCopy}
      title={id ? 'Click to copy System ID' : 'Generated on profile save'}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold font-mono-id transition ${badgeClasses} ${
        id ? 'cursor-pointer hover:opacity-80' : ''
      }`}
    >
      <span>{id || 'ID: Pending'}</span>
      {id && (copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 opacity-60" />)}
    </span>
  );
}