import { PortableText, PortableTextComponents } from '@portabletext/react';
import AIInsightBlock from './blocks/AIInsightBlock';
import ArticleGridBlock from './blocks/ArticleGridBlock';
import CrisisTimelineBlock from './blocks/CrisisTimelineBlock';

const components: PortableTextComponents = {
  types: {
    aiInsightBlock: AIInsightBlock,
    articleGridBlock: ArticleGridBlock,
    crisisTimelineBlock: CrisisTimelineBlock,
  },
};

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}