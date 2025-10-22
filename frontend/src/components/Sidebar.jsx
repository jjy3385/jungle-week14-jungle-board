// frontend/src/components/Sidebar.jsx
export default function Sidebar({ activeTab, onTabChange, user }) {
  const tabs = [
    { id: 'guestbook', label: '방명록' },
    { id: 'posts', label: '게시글' },
  ];

  return (
    <div className="rounded-2xl border border-brand-skyBorder bg-white/90 backdrop-blur shadow-[0_12px_32px_rgba(62,95,138,0.18)] p-5 flex flex-col gap-6 text-brand-navy">
      <div className="flex flex-col items-center gap-3">
        <img
          src={user?.avatar ?? '/images/profile-placeholder.png'}
          alt="profile"
          className="w-24 h-24 rounded-full border-4 border-brand-sky shadow-lg object-cover"
        />
        <div className="text-center">
          <p className="text-lg font-semibold text-brand-navy">
            {user?.username ?? 'Guest'}
          </p>
          <p className="text-xs text-brand-muted mt-1">행복한 하루 되세요!</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full rounded-full px-4 py-2 text-sm transition ${
              activeTab === tab.id
                ? 'bg-brand-sky text-white shadow-[0_8px_18px_rgba(62,95,138,0.25)]'
                : 'bg-brand-skyLight text-brand-navyLight border border-brand-skyBorder hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-xs text-brand-muted border-t border-brand-skyBorder pt-4">
        <p className="mb-2 font-semibold text-brand-navyLight">파도타기</p>
        <ul className="space-y-1">
          <li>놀러가기</li>
        </ul>
      </div>
    </div>
  );
}
