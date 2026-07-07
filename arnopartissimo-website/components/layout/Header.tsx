import Link from 'next/link';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm uppercase tracking-widest">
          Arno Partissimo
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
