import { Navbar } from '@/components/guest/Navbar';
import { Footer } from '@/components/guest/Footer';
import { ReactNode } from 'react';

export default function GuestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}