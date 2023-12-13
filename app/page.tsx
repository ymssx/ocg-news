import Image from "next/image";

export const metadata = {
  title: 'YuGiOh News',
  description: 'Big welcome to Labrynth!',
}

export default function Home() {
  return (
    <main className="p-8 text-center">
      <div className="font-bold text-3xl my-2 mb-4 font-serif">白銀の城のラビュリンス</div>
      <p className="text-gray-700">{metadata.description}</p>
      <p className="text-gray-700">ビッグウェルカム・ラビュリンス</p>
      <div className="flex justify-center mt-8">
        <Image src="/images/labrynth.jpeg" width={300} height={300} alt="Labrynth" />
      </div>
      <ul className="flex gap-2 justify-center mt-8">
        <li className="list-none">
          <a href="/package/list">Package List</a>
        </li>
      </ul>
    </main>
  )
}
