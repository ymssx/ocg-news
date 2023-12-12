import { getPackages } from "@/utils/data";
// import Link from "next/link";

const PackageList = () => {
  const list = getPackages();
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold text-black">卡包</h1>
      <ul className="px-8 list-disc">
        {list.map(id => (
          <li key={id} className="underline text-blue-800"><a href={`/package/detail/${id}`}>{id}</a></li>
        ))}
      </ul>
    </div>
  );
};

export default PackageList;

export const metadata = {
  title: 'Packages',
}