import { getPackages } from "@/utils/data";
import { PackageData } from "../detail/[id]/type";
// import Link from "next/link";

const PackageList = async () => {
  const list = getPackages();
  const listInto: PackageData[] = await Promise.all(list.map(async (id) => (await import(`@/data/package/${id}.json`)).default));
  return (
    <div className="p-8">
      <h1>Packages</h1>
      <ul className="">
        {listInto.sort((a, b) => ((b.lastUpdate || 0) - (a.lastUpdate || 0))).map(({ id, name, desc }) => (
          <li key={id}>
            <a title={desc || name} href={`/package/detail/${id.toLocaleLowerCase()}`}>{name}</a>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <a href="/">Home</a>
      </div>
    </div>
  );
};

export default PackageList;

export const metadata = {
  title: 'Packages',
}