import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, isActive, className, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
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
