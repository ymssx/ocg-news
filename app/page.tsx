import cardDiffList from '@/data/diff/card.json';
import { getPackages } from '@/utils/data';
import Link from 'next/link';
import { CardItem, PackageData } from './package/detail/[id]/type';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Card from '@/components/common/card';
import moment from 'moment';

moment.locale();

export const metadata = {
  title: 'YuGiOh News',
  description: 'Big welcome to Labrynth!',
}

function groupAndSortObjects<T extends { time: number }>(objects: T[]): { date: string; list: T[] }[] {
  // 将对象列表按时间戳排序
  const sortedObjects = objects.sort((a, b) => (b.time || 0) - (a.time || 0));

  const result: { date: string; list: T[] }[] = [];
  let currentGroup: { date: string; list: T[] } | null = null;

  // 遍历排序后的对象列表
  for (const obj of sortedObjects) {
    if (!obj.time) {
      // 对象缺少时间戳，将其放入"Others"组中
      if (!currentGroup || currentGroup.date !== 'Others') {
        currentGroup = { date: 'Others', list: [] };
        result.push(currentGroup);
      }
      currentGroup.list.push(obj);
    } else {
      // 将时间戳转换为日期
      const date = new Date();
      const formattedDate = moment(obj.time).calendar();

      if (!currentGroup || currentGroup.date !== formattedDate) {
        // 创建新的分组
        currentGroup = { date: formattedDate, list: [] };
        result.push(currentGroup);
      }
      currentGroup.list.push(obj);
    }
  }

  return result;
}


export default async () => {
  const packageList = getPackages();
  const listInto: PackageData[] = await Promise.all(
    packageList.filter((_, index) => index <= 20).map(async (id) => (await import(`@/data/package/${id}.json`)).default)
  );

  const cardList = (cardDiffList as (CardItem & { time: number })[]);
  const cardWithImageList = cardList.filter(item => item.image);
  const cardGroups = groupAndSortObjects(cardWithImageList);
  
  return (
    <div className="p-4">
      <section>
        <h1>New</h1>
        {Boolean(cardWithImageList.length) && (
          <div className="flex flex-wrap gap-8 mb-6 w-full overflow-hidden">
            {cardGroups.map(item => (
              <div key={item.date} className="w-full">
                <h2 className='flex gap-2'>
                  {item.date}
                  <span>{Array.from(new Set(item.list.map(item => item.number?.split('-')?.[0]).filter(i => i))).join(', ')}</span>
                </h2>
                <div className="flex flex-wrap gap-8 gap-y-6 w-full overflow-hidden">
                  {item.list.map(item => (
                    <Card data={item} key={item.number} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <ul>
          {cardList.map((item, i) => (
            <li key={item.number}>
              <Link href={`/package/detail/${item.number?.split('-')[0]?.toLocaleLowerCase()}/`}>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <p className="flex gap-2">
                        {item.name}
                        <code>{item.number}</code>
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="min-w-[300px] max-w-[500px]">
                      <div className="mb-2 font-bold">{item?.name}</div>
                      <div className="flex gap-6 items-start">
                        <div className="min-w-[300px] whitespace-pre-wrap">
                          {item?.desc}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </li>
          ))}
        </ul>
      </section>


      <section className="mt-6">
        <h1>Package List</h1>
        {listInto.length < packageList.length && <div className="my-2"><Link href={'/package/list'}>See All</Link></div>}
        <ul className="">
          {listInto.sort((a, b) => ((b.lastUpdate || 0) - (a.lastUpdate || 0))).map(({ id, name, desc }) => (
            <li key={id}>
              <a title={desc || name} href={`/package/detail/${id.toLocaleLowerCase()}`}>{name}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}