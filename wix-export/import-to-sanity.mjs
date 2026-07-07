import { createClient } from '@sanity/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ID = 'rny99uvc';
const DATASET = 'production';
const API_VERSION = '2024-07-01';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!WRITE_TOKEN) {
  throw new Error('Environment variable SANITY_API_WRITE_TOKEN is required');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: WRITE_TOKEN,
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readJson(fileName) {
  const raw = await fs.readFile(path.join(__dirname, fileName), 'utf8');
  return JSON.parse(raw);
}

const siteSettingsData = await readJson('site-settings.json');
const pagesData = await readJson('pages.json');
const projectsData = await readJson('projects.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateKey(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

const GENERIC_OG_IMAGE_ID = 'c36c82_429ca304a9134c3f9f37d78da5af5767';

function parseImageDimensions(url) {
  const match = url.match(/\/v1\/[^/]+\/(w_\d+,h_\d+)[^/]*\//);
  if (!match) return null;
  const dimMatch = match[1].match(/w_(\d+),h_(\d+)/);
  if (!dimMatch) return null;
  return { width: parseInt(dimMatch[1], 10), height: parseInt(dimMatch[2], 10) };
}

function isGenericOgImage(url) {
  return url.includes(GENERIC_OG_IMAGE_ID);
}

function isUsableImage(url) {
  if (isGenericOgImage(url)) return false;
  const dims = parseImageDimensions(url);
  if (!dims) return true;
  return dims.width >= 400 && dims.height >= 400;
}

function makeHighQualityUrl(url) {
  if (!url) return url;
  const needsUpgrade = /q_(50|60)|blur_2|enc_avif|quality_auto/.test(url);
  if (!needsUpgrade) return url;

  return url.replace(
    /\/v1\/[^/]+\/[^/]+\/([^/]+)$/,
    '/v1/fit/w_2500,h_2500,al_c,q_90,usm_0.66_1.00_0.01/$1'
  );
}

const assetCache = new Map();

async function uploadImage(sourceUrl) {
  if (assetCache.has(sourceUrl)) {
    return assetCache.get(sourceUrl);
  }

  const tryUrl = makeHighQualityUrl(sourceUrl);
  const urlsToTry = tryUrl === sourceUrl ? [sourceUrl] : [tryUrl, sourceUrl];

  let lastError;
  for (const url of urlsToTry) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') || undefined;
      const filename = path.basename(new URL(url).pathname) || 'image';

      const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType,
      });

      assetCache.set(sourceUrl, asset._id);
      console.log(`  uploaded asset ${asset._id} (${(asset.size / 1024).toFixed(1)} KB)`);
      return asset._id;
    } catch (err) {
      lastError = err;
      console.warn(`  upload attempt failed for ${url}: ${err.message}`);
    }
  }

  throw new Error(`Could not upload image ${sourceUrl}: ${lastError?.message}`);
}

async function buildMediaObject(url) {
  const assetId = await uploadImage(url);
  return {
    _type: 'media',
    type: 'image',
    image: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
    },
  };
}

// ---------------------------------------------------------------------------
// Portable text helper
// ---------------------------------------------------------------------------

function descriptionToPortableText(text) {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      _key: generateKey('pt-'),
      _type: 'block',
      style: 'normal',
      children: [{ _key: generateKey('span-'), _type: 'span', text: line, marks: [] }],
      markDefs: [],
    }));
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

const categories = [
  {
    _id: 'category-photo',
    _type: 'category',
    title: 'Photo',
    slug: { _type: 'slug', current: 'photo' },
  },
  {
    _id: 'category-creative-direction',
    _type: 'category',
    title: 'Creative Direction',
    slug: { _type: 'slug', current: 'creative-direction' },
  },
];

function categoryRefForProject(project) {
  const meta = project.metadata || {};
  const role = (meta.role || '').toLowerCase();
  const tagString = (meta.tags || []).join(' ').toLowerCase();

  if (
    role.includes('creative direction') ||
    role.includes('graphic design') ||
    tagString.includes('creative direction') ||
    tagString.includes('graphic design')
  ) {
    return { _type: 'reference', _ref: 'category-creative-direction' };
  }

  return { _type: 'reference', _ref: 'category-photo' };
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

function extractContactDescription(contactText) {
  if (!contactText) return '';
  const start = contactText.indexOf('Since 2016');
  if (start === -1) return '';
  const end = contactText.indexOf('INSTAGRAM.', start);
  const snippet = end === -1 ? contactText.slice(start) : contactText.slice(start, end);
  return snippet.replace(/\s+/g, ' ').trim();
}

const siteSettingsDoc = {
  _id: 'site-settings',
  _type: 'siteSettings',
  title: 'Arno Partissimo',
  description: extractContactDescription(pagesData.contact?.text || ''),
  contactEmail: (siteSettingsData.contactEmail || '').toLowerCase().trim(),
  footerText: 'Available worldwide for booking & general inquiries.',
  socialLinks: siteSettingsData.socialLinks || [],
};

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

async function buildPageDocs() {
  // Home page only shows featured projects from projectsQuery; no imported sections.
  const homeSections = [];

  const creativeOrder = ['finalshow', 'upinthesky', 'delxps13', 'complicated', 'wannabeloved'];
  const creativeSections = creativeOrder
    .filter((slug) => projectsData[slug])
    .map((slug) => ({
      _key: generateKey('creative-'),
      _type: 'reference',
      _ref: `project-${slug}`,
    }));

  const contactBio = extractContactDescription(pagesData.contact?.text || '');
  const contactImageUrl = pagesData.contact?.images?.[0];
  const contactSections = [];

  if (contactBio) {
    contactSections.push({
      _key: generateKey('contact-'),
      _type: 'textBlock',
      text: descriptionToPortableText(contactBio),
    });
  }

  if (contactImageUrl) {
    const media = await buildMediaObject(contactImageUrl);
    contactSections.push({ ...media, _key: generateKey('contact-') });
  }

  return [
    {
      _id: 'page-home',
      _type: 'page',
      title: 'Home',
      slug: { _type: 'slug', current: 'home' },
      sections: homeSections,
    },
    {
      _id: 'page-creative',
      _type: 'page',
      title: 'Creative Direction',
      slug: { _type: 'slug', current: 'creative' },
      sections: creativeSections,
    },
    {
      _id: 'page-contact',
      _type: 'page',
      title: 'Contact',
      slug: { _type: 'slug', current: 'contact' },
      metaDescription: contactBio,
      sections: contactSections,
    },
  ];
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

async function buildProjectDocs() {
  const docs = [];
  let order = 0;

  for (const [key, project] of Object.entries(projectsData)) {
    if (key === 'stadedefranceapplication') continue;

    order += 1;
    const meta = project.metadata || {};
    const images = project.images || [];

    const validImages = images.filter(isUsableImage);
    const fallbackImages = validImages.length > 0 ? validImages : images;

    let coverImage;
    const gallery = [];

    for (let i = 0; i < fallbackImages.length; i++) {
      const url = fallbackImages[i];
      const media = await buildMediaObject(url);
      if (i === 0) {
        coverImage = media;
      } else {
        gallery.push({ ...media, _key: generateKey('gallery-') });
      }
    }

    const credits = meta.credits || meta.management || meta.label || '';

    docs.push({
      _id: `project-${meta.slug || key}`,
      _type: 'project',
      title: meta.title || project.title || key,
      slug: { _type: 'slug', current: meta.slug || key },
      category: categoryRefForProject(project),
      year: meta.year ?? null,
      client: meta.client,
      role: meta.role,
      tags: meta.tags || [],
      description: descriptionToPortableText(meta.description),
      credits,
      coverImage,
      gallery,
      status: 'published',
      isFeatured: true,
      order,
    });
  }

  return docs;
}

// ---------------------------------------------------------------------------
// Run import
// ---------------------------------------------------------------------------

const pageDocs = await buildPageDocs();
const projectDocs = await buildProjectDocs();

const tx = client.transaction();

for (const cat of categories) {
  tx.createOrReplace(cat);
}

tx.createOrReplace(siteSettingsDoc);

for (const project of projectDocs) {
  tx.createOrReplace(project);
}

for (const page of pageDocs) {
  tx.createOrReplace(page);
}

console.log(
  `Committing ${categories.length} categories, 1 siteSettings, ${pageDocs.length} pages, ${projectDocs.length} projects…`
);
const result = await tx.commit();
console.log('Import committed:', result);

// ---------------------------------------------------------------------------
// Verify
// ---------------------------------------------------------------------------

const [categoryCount, siteCount, pageCount, projectCount] = await Promise.all([
  client.fetch('count(*[_type == "category"])'),
  client.fetch('count(*[_type == "siteSettings"])'),
  client.fetch('count(*[_type == "page"])'),
  client.fetch('count(*[_type == "project"])'),
]);

console.log('\nVerification:');
console.log(`  categories : ${categoryCount}`);
console.log(`  siteSettings: ${siteCount}`);
console.log(`  pages      : ${pageCount}`);
console.log(`  projects   : ${projectCount}`);
