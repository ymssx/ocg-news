import cardDiffList from '@/data/diff/card.json';
import { getPackages } from '@/utils/data';
import Link from 'next/link';
import { CardItem, PackageData } from './package/detail/[id]/type';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Card from '@/components/common/card';

export const metadata = {
  title: 'YuGiOh News',
  description: 'Big welcome to Labrynth!',
}

export default async () => {
  const packageList = getPackages();
  const listInto: PackageData[] = await Promise.all(
    packageList.filter((_, index) => index <= 20).map(async (id) => (await import(`@/data/package/${id}.json`)).default)
  );

  const cardList = (cardDiffList as CardItem[]);
  const cardWithImageList = cardList.filter(item => item.image);
  
  return (
    <div className="p-4">
      <section>
        <h1>New</h1>
        {Boolean(cardWithImageList.length) && <div className="flex flex-wrap gap-6 mb-6">
          {cardWithImageList.map(item => (
            <Card data={item} key={item.number} />
          ))}
        </div>}
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
          {listInto.map(({ id, name, desc }) => (
            <li key={id}>
              <a title={desc || name} href={`/package/detail/${id.toLocaleLowerCase()}`}>{name}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}