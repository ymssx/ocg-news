export const metadata = {
  title: 'YuGiOh News',
  description: 'This is an informational website that provides news about Yu-Gi-Oh!',
}

export default function Home() {
  return (
    <main className="p-8 text-center">
      <h1>{metadata.title}</h1>
      <p>{metadata.description}</p>
      <ul className="flex gap-2 justify-center mt-8">
        <li className="list-none">
          <a href="/package/list">Package List</a>
        </li>
      </ul>
    </main>
  )
}
