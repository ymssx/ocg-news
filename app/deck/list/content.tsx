'use client';
import Link from "next/link";

export default function DeckList({ decks }: { decks: string[] }) {
  return (
    <div>
      <h1 className="font-bold">上位卡组</h1>
      <ol>
        {decks.map(item => (
          <li key={item}>
            <Link href={`/${navigator.language}/deck/detail/${item}`}>{item}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}