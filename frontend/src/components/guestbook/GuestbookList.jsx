import { useGuestbook } from '../../context/GuestbookContext';

export default function GuestbookList() {
  const { messages, connecting } = useGuestbook();

  if (connecting) {
    return (
      <p className="text-center text-sm text-brand-muted">
        실시간 방명록 연결 중...
      </p>
    );
  }

  if (!messages.length) {
    return (
      <p className="text-center text-sm text-brand-muted">
        첫 번째 방문자가 되어 보세요
      </p>
    );
  }

  return (
    <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
      {messages.map((msg) => (
        <li
          key={msg.id}
          style={{ backgroundColor: msg.color ?? '#ffe5f2' }}
          className="rounded-xl border border-brand-skyBorder shadow-inner px-4 py-3"
        >
          <div className="flex justify-between items-center text-xs text-brand-muted mb-2">
            <span className="font-semibold text-brand-navyLight">
              {msg.author}
            </span>
            <span>{new Date(msg.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-brand-navy whitespace-pre-wrap leading-relaxed">
            {msg.message}
          </p>
          {msg.mood && (
            <span className="mt-2 inline-block text-xs px-2 py-1 rounded-full bg-white/70 border border-brand-skyBorder text-brand-navyLight">
              #{msg.mood}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
