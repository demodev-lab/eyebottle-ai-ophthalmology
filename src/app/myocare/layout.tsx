import { MyoCareHeader } from '@/components/myocare/common/header';

export default function MyoCareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <MyoCareHeader />
      <main className="container mx-auto px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}