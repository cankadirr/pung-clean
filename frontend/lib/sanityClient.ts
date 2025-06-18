import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: '13f1s0mc',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
})

export async function getAllPages() {
  const query = `*[_type == "page"]{_id, title, slug, content}`
  const pages = await sanityClient.fetch(query)
  return pages
}
