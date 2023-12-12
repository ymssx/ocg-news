'use client';
import { useMemo } from "react";
import { cardColorMap, cardFontColorMap } from "../const";
import { CardItem, CardType } from "../type";
import { isMobileDevice, onlyBrowser } from "@/utils/bom";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function extractNumbersFromString(str: string) {
  const regex = /\d+(\.\d+)?/g;
  const match = str.match(regex);
  return match ? Number(match[match.length - 1]) : null;
}

interface Props {
  id: string;
  name: string;
  number: number;
  desc?: string;
  list: CardItem[];
  images?: string[];
}

const CardPackage = ({ list, name, number, desc, images = [] }: Props) => {
  const unSortCardList = useMemo(() => list.filter(item => !item.number), [list]);

  const COL = onlyBrowser(() => isMobileDevice() ? 1 : 3, 3);
  const ROW = Math.ceil(number / COL);
  const UN_SORT_ROW = Math.ceil(unSortCardList.length / COL)

  const cardList: (CardItem | null)[] = useMemo(() => {
    const newList = new Array(number).fill(null);
    list.forEach((item) => {
      if (!item.number) {
        return;
      }
      const index = extractNumbersFromString(item.number);
      if (typeof index === 'number' && index <= number) {
        newList[index - 1] = item;
      }
    })
    return newList;
  }, [list]);

  const colorList = useMemo(() => {
    const newList: CardType[] = new Array(number).fill(CardType.unknown)
    let lastType: CardType | null;
    let lastIndex: number = 0;
    cardList.forEach((item, index) => {
      if (item?.type) {
        newList[index] = item?.type;
        if (item?.type === lastType) {
          for (let i = lastIndex; i <= index; i += 1) {
            newList[i] = item?.type;
          }
        } else {
          if ([CardType.monster].includes(item.type)) {
            for (let i = lastIndex; i <= index; i += 1) {
              newList[i] = item?.type;
            }
          }
          lastIndex = index;
          lastType = item?.type;
        }
      } else if (index === number - 1) {
        if ([CardType.trap].includes(lastType || CardType.unknown)) {
          for (let i = lastIndex; i <= index; i += 1) {
            newList[i] = lastType || CardType.unknown;
          }
        }
      }
    });
    return newList;
  }, [cardList]);

  const renderItem = (item: CardItem | null, index?: number) => {
    const count = (index !== undefined) ? <span className="inline-block opacity-60 min-w-[24px]">{index + 1}</span> : null;
    return (
      <div className="min-h-[32px] h-full flex items-center">
        {item ? (
          <div className="p-1 px-2">
            {count}
            <Dialog>
              <DialogTrigger>
                {/* <span>{item?.number}</span> */}
                <span className={classNames({ 'underline decoration-dotted': item?.image })}>
                  {/* {item?.image ? <img alt={item?.name} src={item?.image} width={15} height={30} /> : null} */}
                  {/* {(item?.image) ? <Link href={item?.image}>{item?.name}</Link> : item?.name} */}
                  {item?.name}
                </span>
              </DialogTrigger>
              <DialogContent className="min-w-[600px] max-w-[720px]">
                <DialogHeader>
                  <DialogTitle className="mb-2">{item?.name}</DialogTitle>
                </DialogHeader>
                <div className="flex gap-6">
                  {item?.image ? <a href={item.image} target="_blank"><img className="rounded-md" alt={item?.name} src={item?.image} width={300} height={450} /></a> : null}
                  <div className="min-w-[300px]">{item?.desc || '-'}</div>
                </div>
              </DialogContent>
            </Dialog>
            {item?.isNew ? <span className="ml-1 text-xs">[new]</span> : null}
          </div>
        ) : <div className="min-h-[32px] w-full px-2 bg-black bg-opacity-10 flex items-center">{count}</div>}
      </div>
    );
  }

  const viewList = new Array(number).fill(0).map((_, index) => {
    const item = cardList[index];
    return renderItem(item, index);
  });

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">{name}</h1>
      <div className="mb-2 pb-4 flex gap-4 justify-start">
        <div className="h-full">
          <div className="text-gray-900">{...(desc || '-').split('\n').map((item, index) => <div key={index}>{item}</div>)}</div>
        </div>
      </div>
      <div className="mb-8">
        {images.map(src => (
          <img key={src} className="max-h-[150px]" src={src} alt={name} />
        ))}
      </div>
  
      {/* <div className="font-bold mb-2 text-black">卡表</div> */}
      <table className="border-collapse max-w-[1200px]">
        <tbody className="">
          {new Array(ROW).fill(0).map((_, row) => (
            <tr key={row} className="">
              {new Array(COL).fill(0).map((_, ceil) => (
                <td
                  key={ceil}
                  className={classNames({ 'p-0 border-gray-500 min-h-[32px] w-[25%]': true, border: ceil * ROW + row < number })}
                  style={{
                    background: ceil * ROW + row < number ? cardColorMap[colorList[ceil * ROW + row] || CardType.unknown] : 'none',
                    color: cardFontColorMap[colorList[ceil * ROW + row] || CardType.unknown],
                    // borderColor: cardFontColorMap[colorList[ceil * ROW + row] || CardType.unknown],
                  }}
                >
                  {viewList[ceil * ROW + row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {unSortCardList.length ? (
        <div className="mt-6 flex flex-col">
          <div className="font-bold mb-2 text-black">未知编号</div>
          <table className="border-collapse max-w-[1200px]">
            <tbody className="">
              {new Array(UN_SORT_ROW).fill(0).map((_, row) => (
                <tr key={row} className="">
                  {new Array(COL).fill(0).map((_, ceil) => (
                    <td
                      key={ceil}
                      className={classNames({ 'p-0 border-gray-500 min-h-[32px] w-[25%]': true, border: (ceil * UN_SORT_ROW + row) < unSortCardList.length })}
                      style={{
                        background: (ceil * UN_SORT_ROW + row) < unSortCardList.length ? cardColorMap[unSortCardList[ceil * UN_SORT_ROW + row]?.type || CardType.unknown] : 'none',
                        color: cardFontColorMap[unSortCardList[ceil * UN_SORT_ROW + row]?.type || CardType.unknown],
                        // borderColor: cardFontColorMap[unSortCardList[ceil * UN_SORT_ROW + row]?.type || CardType.unknown],
                      }}
                    >
                      {renderItem(unSortCardList[ceil * UN_SORT_ROW + row])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default CardPackage;