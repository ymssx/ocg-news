import { PackageData } from "./type";
import CardPackage from './components/list';
import Head from "next/head";
import { getPackages } from "@/utils/data";

export default async ({ params }: {
  params: { id: string }
}) => {
  const { id } = params;
  const data: PackageData = (await import(`@/data/package/${id}.json`)).default;

  return (
    <>
      <Head>
        <title>{data?.name || 'Package Detail'}</title>
        <meta name="description" content={data?.desc} />
      </Head>
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

export const metadata = {
  title: 'Package Detail',
}