import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: '13f1s0mc',    // Sanity projenin ID’si
  dataset: 'production',           // Dataset ismi, genelde 'production'
  useCdn: true,                   // CDN’den hızlı veri çekmek için
  apiVersion: '2023-01-01',       // API versiyonu (güncel tarih)
})

// GROQ sorgusu ile veri çekme fonksiyonu
export async function getAllPages() {
  const query = `*[_type == "page"]{title, slug, content}`
  const pages = await sanityClient.fetch(query)
  return pages
}