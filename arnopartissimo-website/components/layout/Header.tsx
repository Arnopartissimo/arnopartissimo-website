import { Logo } from '@/components/design-system/Logo';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-4 sm:px-6 lg:px-8">
        <Logo className="mb-2" />
        <Navigation />
      </div>
    </header>
  );
}
