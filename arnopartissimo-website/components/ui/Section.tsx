import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 md:py-20', className)}>
      {children}
    </section>
  );
}
