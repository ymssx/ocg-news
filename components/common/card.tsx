'use client';
import { CardItem } from '@/app/package/detail/[id]/type';
import classNames from 'classnames';
import { useState } from 'react';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  data: CardItem;
};

export default function Card({ data }: Props) {
  const [showImg, setShowImg] = useState(true);
  return (
    <div className="flex gap-3 h-[175px] max-w-[600px]">
      <div className='w-[120px] flex-shrink-0 bg-gray-100'>
        {data.image && <Image
          width={120}
          height={175}
          alt={data.name}
          src={data.image}
          className={classNames({ 'opacity-0': !showImg })}
          onError={() => setShowImg(false)}
        />}
      </div>
      <div className="overflow-auto">
        <div className="font-bold">{data.name}</div>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <div className="mt-1 text-sm text-gray-600 whitespace-pre-wrap line-clamp-5">
                {data.desc}
              </div>
            </TooltipTrigger>
            <TooltipContent className="min-w-[300px] max-w-[500px]">
              {data.desc}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}