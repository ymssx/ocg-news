import { PackageData } from "./type";
import CardPackage from './components/list';
import { getPackages } from "@/utils/data";
import { Metadata } from "next/types";
import { getCardListByNames } from "@/lib/cdb";

export async function generateMetadata(
  { params }: {
    params: { id: string }
  },
): Promise<Metadata> {
  const { id } = params;
  const data: PackageData = (await import(`@/data/package/${id}.json`)).default;
 
  return {
    title: data?.name,
    description: data?.desc,
  }
}

export default async ({ params }: {
  params: { id: string }
}) => {
  const { id } = params;
  const path = `@/data/package/${id}.json`;
  const _data: PackageData = (await import(`@/data/package/${id}.json`)).default;

  const noDetailCards = _data.list.filter(card => !card.desc).map(card => card.name).filter(item => item);
  const detailCards = await getCardListByNames(noDetailCards);
  const nameMap = detailCards.reduce((map, item) => {
    if (item.desc) {
      return {
        ...map,
        [item.name]: item,
      };
    }
    return map;
  }, {});
  _data.list.forEach(card => {
    if (!card.desc && nameMap[card.name]) {
      card.desc = nameMap[card.name].desc;
      card.type = nameMap[card.name].type;
    }
  })

  return (
    <>
      <div className="p-2">
        <CardPackage originDara={_data} path={path} />
      </div>

      <div className="p-2 px-6 flex gap-4">
        <a href="/">Home</a>
        <a href="/package/list">Package List</a>
      </div>
    </>
  );
}

const generateStaticParams = () => {
  return getPackages().map(id => ({ id }));
};
export { generateStaticParams };

// export const metadata = {
//   title: 'Package Detail',
// }