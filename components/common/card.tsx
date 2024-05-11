import { CardItem } from '@/app/package/detail/[id]/type';

interface Props {
  data: CardItem;
};

export default function Card({ data }: Props) {
  return (
    <div className="flex gap-2 h-[175px] max-w-[600px]">
      <div className='w-[120px] flex-shrink-0'>
        <img src={data.image} />
      </div>
      <div className="overflow-auto">
        <div className="font-bold">{data.name}</div>
        <div className="text-sm text-gray-600">{data.desc || '-'}</div>
      </div>
    </div>
  );
}