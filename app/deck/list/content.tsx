'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DeckList({ decks }: { decks: string[] }) {
  const [lang, setlang] = useState('ja-JP');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setlang(window.navigator.language);
    }
  }, []);

  return (
    <div>
      <h1 className="font-bold">上位卡组</h1>
      <ol>
        {decks.map(item => (
          <li key={item}>
            <Link href={`/${lang}/deck/detail/${item}`}>{item}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}