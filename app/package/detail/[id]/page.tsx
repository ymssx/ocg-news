import { PackageData } from "./type";
import CardPackage from './components/list';
import Head from "next/head";
import { getPackageImage, getPackages } from "@/utils/data";

export default async ({ params }: {
  params: { id: string }
}) => {
  const { id } = params;
  const data: PackageData = (await import(`@/data/package/${id}.json`)).default;
  const imagePath = getPackageImage(id);

  return (
    <>
      <Head>
        <title>{data?.name || 'Package Detail'}</title>
        <meta name="description" content={data?.desc} />
      </Head>
      <div className="p-2">
        <CardPackage {...data} imagePath={imagePath} />
      </div>
    </>
  );
}

const generateStaticParams = () => {
  return getPackages().map(id => ({ id }));
};
export { generateStaticParams };