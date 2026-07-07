import { cn } from '@/lib/utils/cn';

interface FooterColumnProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function FooterColumn({ title, children, className }: FooterColumnProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {title && <h3 className="text-[10px] uppercase tracking-[0.3em] text-white">{title}</h3>}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
