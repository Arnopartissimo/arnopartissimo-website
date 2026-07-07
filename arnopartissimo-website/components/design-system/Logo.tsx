import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'text-[20px] uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-80',
        className
      )}
    >
      ARNO PARTISSIMO.
    </Link>
  );
}
