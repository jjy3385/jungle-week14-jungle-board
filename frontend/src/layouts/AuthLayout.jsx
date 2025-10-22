export default function AuthLayout({ children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#c9e7ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 border border-[#c4d9f2] rounded-3xl shadow-[0_20px_45px_rgba(62,95,138,0.18)] p-8">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1f2f4a] tracking-[0.3em] uppercase">
            My Mini Home
          </h1>
          <p className="text-sm text-[#61738a] mt-2">
            방문을 환영합니다! 오늘도 좋은 하루 보내세요 ♡
          </p>
        </header>

        {children}

        {footer && (
          <footer className="mt-6 text-center text-sm text-brand-muted">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
