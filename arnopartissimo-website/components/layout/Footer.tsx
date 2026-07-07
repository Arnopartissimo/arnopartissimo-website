import { SiteSettings } from '@/types';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-neutral-500">
          {settings?.footerText || `© ${new Date().getFullYear()} Arno Partissimo`}
        </p>
        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <ul className="flex gap-4">
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 hover:text-black"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
