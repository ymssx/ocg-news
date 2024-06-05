import { transYdk } from '@/lib/ydk';
import { getDataFileContent, getYdkFiles } from '@/utils/data';
import { getCardList } from '@/lib/cdb';
import Link from 'next/link';

interface Params { lang: string; id: string[] }

export default async function DeckPage({ params }: { params: Params }) {
  const { lang, id } = params;

  const rawData = await getDataFileContent(`./data/decks/${decodeURIComponent(id.join('/'))}.ydk`);
  const data = transYdk<{
    title?: string;
    desc?: string;
    main: string[];
    extra?: string[];
    side?: string[];
  }>(rawData);
  const mainList = await getCardList(data.main, lang);
  const extraList = await getCardList(data.extra || [], lang);
  const sideList = await getCardList(data.side || [], lang);
  return (
    <div className="p-4">
      <h1 className="font-bold">{data.title || '-'}</h1>
      <div>{data.desc || '-'}</div>
      <main className="flex flex-col gap-4 mt-8">
        <div>
          <h3>main</h3>
          <ol>{mainList?.map(item => <li key={item.id}><Link href={`/${lang}/card/detail/${item.id}`}>{item.name}</Link></li>)}</ol>
        </div>
        <div>
          <h3>extra</h3>
          <ol>{extraList?.map(item => <li key={item.id}><Link href={`/${lang}/card/detail/${item.id}`}>{item.name}</Link></li>)}</ol>
        </div>
        <div>
          <h3>side</h3>
          <ol>{sideList?.map(item => <li key={item.id}><Link href={`/${lang}/card/detail/${item.id}`}>{item.name}</Link></li>)}</ol>
        </div>
      </main>
    </div>
  );
};

const generateStaticParams = () => {
  const params: Params[] = [];
  const decks = getYdkFiles();
  for (const lang of ['en-US', 'zh-CN', 'ja-JP']) {
    for (const id of decks) {
      params.push({ lang, id: id.split('/') });
    }
  };
  return params;
};
export { generateStaticParams };