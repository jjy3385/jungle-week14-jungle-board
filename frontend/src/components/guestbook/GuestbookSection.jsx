import GuestbookForm from './GuestbookForm';
import GuestbookList from './GuestbookList';

export default function GuestbookSection() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-brand-navy drop-shadow">
          ☆ 오늘도 방문해주셔서 감사해요!
        </h2>
        <p className="text-sm text-brand-muted mt-1">
          간단한 인사나 추억을 남겨 주세요 :)
        </p>
      </div>
      <GuestbookForm />
      <GuestbookList />
    </div>
  );
}
