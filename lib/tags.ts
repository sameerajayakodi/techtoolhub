import tagData from 'app/tag-data.json'

/** Tags need at least this many published articles before their page is indexed and in the sitemap */
export const MIN_INDEXABLE_TAG_POSTS = 2

export const isIndexableTag = (tag: string) =>
  ((tagData as Record<string, number>)[tag] ?? 0) >= MIN_INDEXABLE_TAG_POSTS
