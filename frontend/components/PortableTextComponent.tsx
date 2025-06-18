import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types'; // PortableTextBlock tipi için

// Sanity'deki Portable Text içeriğini render etmek için özel bileşenler
const components: PortableTextComponents = {
  types: {
    // Örneğin, özel bir resim bileşeni ekleyebilirsiniz:
    // image: ({value}) => <img src={value.asset.url} alt={value.alt} className="w-full h-auto rounded-lg my-4" />,
    // Diğer özel blok tipleri buraya gelebilir.
  },
  block: {
    h1: ({children}) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-3xl font-bold my-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-2xl font-bold my-2">{children}</h3>,
    h4: ({children}) => <h4 className="text-xl font-bold my-2">{children}</h4>,
    normal: ({children}) => <p className="text-gray-700 my-1 leading-relaxed">{children}</p>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-5 my-2">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="mb-1">{children}</li>,
    number: ({children}) => <li className="mb-1">{children}</li>,
  },
  marks: {
    link: ({children, value}) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
  },
};

interface PortableTextComponentProps {
  blocks: PortableTextBlock[];
}

const PortableTextComponent: React.FC<PortableTextComponentProps> = ({ blocks } ) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }
  return <PortableText value={blocks} components={components} />;
};

export default PortableTextComponent;