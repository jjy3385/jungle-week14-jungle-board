export default function MiniHomeLayout({ sidebar, children, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-skyLight to-[#c9e7ff] font-minihome text-brand-navy">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-6 rounded-xl bg-white/95 border border-brand-skyBorder shadow-[0_10px_25px_rgba(62,95,138,0.15)] px-6 py-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy tracking-widest uppercase">
              My Mini Home
            </h1>
            <p className="text-xs mt-1 text-brand-navyLight">
              오늘도 방문해 주셔서 감사해요 ♡
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-brand-navyLight">
            <span className="bg-brand-skyLight border border-brand-skyBorder px-3 py-1 rounded-full">
              Visitor 1024
            </span>
            <button className="bg-brand-sky hover:bg-brand-navyLight text-white px-4 py-1 rounded-full shadow">
              ♫ Play BGM
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-1 border border-brand-skyBorder text-brand-navy rounded-full hover:bg-brand-skyLight transition"
              >
                로그아웃
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside>{sidebar}</aside>
          <main className="rounded-2xl bg-white/90 border border-brand-skyBorder shadow-[0_18px_40px_rgba(62,95,138,0.18)] p-6">
            {children}
          </main>
        </div>

        <footer className="mt-12 text-center text-xs text-brand-muted">
          © {new Date().getFullYear()} My Mini Home
        </footer>
      </div>
    </div>
  );
}
