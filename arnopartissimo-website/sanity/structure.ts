import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
    ]);
