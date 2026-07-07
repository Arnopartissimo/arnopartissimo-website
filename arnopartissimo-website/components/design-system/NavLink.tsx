import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function NavLink({ href, children, isActive, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'text-[11px] uppercase tracking-[0.2em] transition-colors duration-100',
        isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
}
