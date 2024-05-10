import cardDiffList from '@/data/diff/card.json';
import Link from 'next/link';

export default () => {
  return (
    <div className="p-4">
      <h1>New</h1>
      <ul>
        {cardDiffList.map((card, i) => (
          <li key={card.number}>
            <Link href={`/package/detail/${card.number?.split('-')[0]?.toLocaleLowerCase()}/`}>
              {card.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}