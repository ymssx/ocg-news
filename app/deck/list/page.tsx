import { getYdkFiles } from "@/utils/data";
import DeckList from './content';

export default function DeckListPage() {
  const decks = getYdkFiles() || [];
  return (
    <div className="p-4">
      <DeckList decks={decks} />
    </div>
  );
}