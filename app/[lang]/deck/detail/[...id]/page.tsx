import { transYdk } from '@/lib/ydk';
import { getDataFileContent, getYdkFiles } from '@/utils/data';
import { getCardList, getFinalType } from '@/lib/cdb';
import CardTable from '@/components/common/card-table';

function getCardTableData(list) {
  return {
    number: list.length,
    fromZero: false,
    hasSecret: false,
    list: list.map((item, index) => ({
      ...item, number: `DK-JP${String(index + 1).padStart(3 - String(index + 1).length, '0')}`,
      type: getFinalType(item.type, item.type2),
    })),
  };
}

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
  console.log(mainList)
  return (
    <div className="p-4">
      <h1 className="">
        {data.title || '-'}
      </h1>
      <div className="mb-2 pb-4 flex gap-4 justify-start">
        <div className="h-full">
          <div className="text-gray-900 bg-gray-50 p-4 rounded-md w-full whitespace-pre-wrap">
            {data.desc || '-'}
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2">main</h2>
          <CardTable originDara={getCardTableData(mainList) as any} path='' />
          {/* <ol>{mainList?.map(item => <li key={item.id}><Link href={`/${lang}/card/detail/${item.id}`}>{item.name}</Link></li>)}</ol> */}
        </div>
        <div>
          <h2 className="mb-2">extra</h2>
          <CardTable originDara={getCardTableData(extraList) as any} path='' />
          {/* <ol>{extraList?.map(item => <li key={item.id}><Link href={`/${lang}/card/detail/${item.id}`}>{item.name}</Link></li>)}</ol> */}
        </div>
        <div>
          <h2 className="mb-2">side</h2>
          <CardTable originDara={getCardTableData(sideList) as any} path='' />
          {/* <ol>{sideList?.map(item => <li key={item.id}><Link href={`/${lang}/card/detail/${item.id}`}>{item.name}</Link></li>)}</ol> */}
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