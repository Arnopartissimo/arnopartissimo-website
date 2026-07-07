import { JsonLd } from './JsonLd';

interface SeoProps {
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({ jsonLd }: SeoProps) {
  if (!jsonLd) return null;
  return <JsonLd data={jsonLd} />;
}
