import { PackageData } from "./type";
import CardPackage from './components/list';
import { getPackages } from "@/utils/data";
import { Metadata } from "next/types";

export async function generateMetadata(
  { params }: {
    params: { id: string }
  },
): Promise<Metadata> {
  const { id } = params || 'Package Detail';
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
  const data: PackageData = (await import(`@/data/package/${id}.json`)).default;

  return (
    <>
      <div className="p-2">
        <CardPackage {...data} />
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