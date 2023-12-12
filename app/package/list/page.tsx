import { getPackages } from "@/utils/data";
import { PackageData } from "../detail/[id]/type";
// import Link from "next/link";

const PackageList = async () => {
  const list = getPackages();
  const listInto: PackageData[] = await Promise.all(list.map(async (id) => (await import(`@/data/package/${id}.json`)).default));
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold text-black">卡包</h1>
      <ul className="px-8 list-disc">
        {listInto.map(({ id, name, desc }) => (
          <li key={id} className="underline text-blue-800">
            <a title={desc || name} href={`/package/detail/${id.toLocaleLowerCase()}`}>{name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PackageList;

export const metadata = {
  title: 'Packages',
}