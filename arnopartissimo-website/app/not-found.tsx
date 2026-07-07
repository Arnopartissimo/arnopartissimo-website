import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-2xl text-foreground">Page not found</h1>
      <Link href="/" className="mt-4 underline underline-offset-4">
        Back home
      </Link>
    </div>
  );
}
