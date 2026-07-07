import Link from 'next/link';

const navItems = [
  { label: 'Creative Direction', href: '/creative' },
  { label: 'Contact', href: '/contact' },
];

export function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm uppercase tracking-wide hover:opacity-60">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
