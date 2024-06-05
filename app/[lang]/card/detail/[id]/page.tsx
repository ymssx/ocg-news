import { transYdk } from '@/lib/ydk';
import { getDataFileContent } from '@/utils/data';
import { getCardData } from '@/lib/cdb';
import { Metadata } from 'next';

interface Params { lang: string; id: string }

export async function generateMetadata(
  { params }: {
    params: Params
  },
): Promise<Metadata> {
  const { lang, id } = params;
  const data = await getCardData(id, lang);
 
  return {
    title: data?.name,
    description: data?.desc,
  }
}

export default async function CardDetail({ params }: { params: Params }) {
  const { lang, id } = params;
  const data = await getCardData(id, lang);
  return (
    <div className="p-4">
      <h1 className="font-bold">{data.name}</h1>
      <div>{data.desc}</div>
    </div>
  );
};

const generateStaticParams = async () => {
  const params: Params[] = [];

  // TODO: mock
  const rawData = await getDataFileContent('./data/decks/others/labrynth.ydk');
  const data = transYdk<{
    title?: string;
    desc?: string;
    main: string[];
    extra?: string[];
    side?: string[];
  }>(rawData);
  const cardList = Array.from(new Set([
    ...data.main,
    ...(data.extra || []),
    ...(data.side || []),
  ]));

  for (const lang of ['en-US', 'zh-CN', 'ja-JP']) {
    for (const id of cardList) {
      params.push({ lang, id });
    }
  };
  return params;
};
export { generateStaticParams };