'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavLink } from '@/components/design-system/NavLink';

const navItems = [
  { label: 'PHOTO.', href: '/' },
  { label: 'CREATIVE DIRECTION.', href: '/creative' },
  { label: 'CONTACT', href: '/contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav aria-label="Main navigation" className="hidden md:block">
        <ul className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <NavLink href={item.href} isActive={isActive}>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="md:hidden text-foreground p-2"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="block h-0.5 w-6 bg-current mb-1" />
        <span className="block h-0.5 w-6 bg-current mb-1" />
        <span className="block h-0.5 w-6 bg-current" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute top-4 right-4 text-foreground p-2"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      isActive={isActive}
                      className="text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
