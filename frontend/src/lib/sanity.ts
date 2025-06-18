// src/lib/sanity.ts
import {{ createClient }} from '@sanity/client';
import type {{ SanityClient }} from '@sanity/client';

export const client: SanityClient = createClient({{
  projectId: 'z4hxfpe8', // Doğru Project ID'niz
  dataset: 'production',
  apiVersion: '2025-06-15', // API versiyonunuzu güncelledik
  useCdn: true,
}});

// Sanity'den resim URL'leri oluşturmak için bir yardımcı fonksiyon (ileride kullanacağız)
// import imageUrlBuilder from '@sanity/image-url';
// const builder = imageUrlBuilder(client);
// export function urlFor(source: any) {{
//   return builder.image(source);
// }}