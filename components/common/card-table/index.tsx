'use client';
import { useEffect, useMemo, useState } from "react";
import { cardColorMap, cardFontColorMap } from "./const";
import { CardItem, CardType } from "./type";
import { isMobileDevice, onlyBrowser } from "@/utils/bom";
import classNames from "classnames";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProxyJson } from "@/components/e-components/core";
import EText from "@/components/e-components/text";
import EContainer from "@/components/e-components/container";
import { hasAuth as getHasAuth } from "@/components/e-components/core/auth";
import { useJson } from "@/components/e-components/core/hooks";


function extractNumbersFromString(str: string) {
  if (str.includes('?')) {
    return null;
  }
  const regex = /\d+(\.\d+)?/g;
  const match = str.match(regex);
  return match ? Number(match[match.length - 1]) : null;
}

function isTypeNone(type?: CardType) {
  return !type || type === CardType.unknown;
}

// convert #hex notation to rgb array
var parseColor = function (hexStr: string) {
  return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
};

// zero-pad 1 digit to 2
var pad = function (s: string) {
  return (s.length === 1) ? '0' + s : s;
};

var gradientColors = function (_start: string, _end: string, steps: number, gamma: number) {
  var i, j, ms, me, output: string[] = [], so: string[] = [];
  gamma = gamma || 1;
  var normalize = function (channel: number) {
    return Math.pow(channel / 255, gamma);
  };
  const start = parseColor(_start).map(normalize);
  const end = parseColor(_end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
    }
    output.push('#' + so.join(''));
  }
  return output;
};

interface _Props {
  id: string;
  name: string;
  number: number;
  desc?: string;
  list: CardItem[];
  images?: string[];
  fromZero?: boolean;
  hasSecret?: boolean;
  links?: { title: string; href: string }[];
}

interface Props {
  // data: _Props;
  originDara: _Props;
  path: string;
}

const CardPackage = ({ originDara: _originData, path }: Props) => {
  const [originDara, data] = useJson(path, _originData);
  const list = data.list;

  const { number: _number, fromZero, hasSecret } = originDara;
  const number = hasSecret ? _number + 1 : _number;
  const unSortCardList = useMemo(() => list.filter(item => !(item.number?.get() && !item.number?.get()?.includes('?'))), [list]);

  const COL = onlyBrowser(() => isMobileDevice() ? 1 : 3, 3);
  const ROW = Math.ceil(number / COL);
  const UN_SORT_ROW = Math.ceil(unSortCardList.length / COL);

  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    setHasAuth(getHasAuth());
  }, []);

  // 渲染相关

  const cardList: (ProxyJson<CardItem> | null)[] = useMemo(() => {
    const newList = new Array(number).fill(null);
    list.forEach(item => {
      if (!item.number) {
        return;
      }
      let index: number | null;
      const numberSplit = item.number?.get()?.split('-') || '';
      if (numberSplit[numberSplit.length - 1]?.toUpperCase() === 'JPS01') {
        index = number - 1;
      } else {
        index = extractNumbersFromString(item.number?.get() || '');
      }
      if (typeof index === 'number' && index <= number) {
        newList[index - (fromZero ? 0 : 1)] = item;
      }
    });
    return newList;
  }, [list]);

  const colorList = useMemo(() => {
    const newList: CardType[] = new Array(number).fill(CardType.unknown);
    const newColorList: { bg: string; font: string }[] = new Array(number);
    let lastType: CardType | null;
    let lastIndex: number = 0;
    cardList.forEach((item, index) => {
      if (
        index > 1
        && isTypeNone(newList[index - 1])
      ) {
        if (
          // !isTypeNone(item?.type)
          !isTypeNone(newList[index - 2])
        ) {
          newColorList[index - 1] = {
            bg: `linear-gradient(to bottom, ${cardColorMap[cardList[index - 2]?.type?.get() || CardType.unknown]}, ${cardColorMap[item?.type?.get() || CardType.unknown]})`,
            font: cardFontColorMap[newList[index - 2] || CardType.unknown],
          };
        } else if (
          !isTypeNone(item?.type?.get())
          // !isTypeNone(newList[index - 2])
        ) {
          newColorList[index - 1] = {
            bg: `linear-gradient(to bottom, ${cardColorMap[cardList[index - 2]?.type?.get() || CardType.unknown]}, ${cardColorMap[item?.type?.get() || CardType.unknown]})`,
            font: cardFontColorMap[newList[index - 2] || CardType.unknown],
          };
        }
      }

      if (item?.type) {
        newList[index] = item?.type?.get();
        if (item?.type?.get() === lastType) {
          for (let i = lastIndex; i <= index; i += 1) {
            if (newList[i] === CardType.unknown) {
              newList[i] = item?.type?.get();
              if (newColorList[i]) {
                delete newColorList[i];
              }
            }
          }
        } else {
          if ([CardType.monster].includes(item.type?.get())) {
            for (let i = lastIndex; i <= index; i += 1) {
              if (newList[i] === CardType.unknown) {
                newList[i] = item?.type?.get();
                if (newColorList[i]) {
                  delete newColorList[i];
                }
              }
            }
          }
          lastIndex = index;
          lastType = item?.type?.get();
        }
      } else if (index === (hasSecret ? (number - 2) : (number - 1))) {
        if ([CardType.trap].includes(lastType || CardType.unknown)) {
          for (let i = lastIndex; i <= index; i += 1) {
            newList[i] = lastType || CardType.unknown;
            if (newColorList[i]) {
              delete newColorList[i];
            }
          }
        }
      }

      // A - 无 - 无 - B的场景，中间两个格子的渐变
      if (
        index > 2
        && !isTypeNone(newList[index])
        && isTypeNone(newList[index - 1])
        && isTypeNone(newList[index - 2])
        && !isTypeNone(newList[index - 3])
      ) {
        const midColor = gradientColors(cardColorMap[cardList[index - 3]?.type?.get() || CardType.unknown], cardColorMap[item?.type?.get() || CardType.unknown], 3, 2.2)[1];
        newColorList[index - 1] = {
          bg: `linear-gradient(to bottom, ${midColor}, ${cardColorMap[item?.type?.get() || CardType.unknown]})`,
          font: cardFontColorMap[newList[index] || CardType.unknown],
        };
        newColorList[index - 2] = {
          bg: `linear-gradient(to bottom, ${cardColorMap[cardList[index - 3]?.type?.get() || CardType.unknown]}, ${midColor})`,
          font: cardFontColorMap[newList[index - 3] || CardType.unknown],
        };
      }
    });
    for (let index = 0; index < number; index += 1) {
      if (!newColorList[index]) {
        newColorList[index] = {
          bg: cardColorMap[newList[index] || CardType.unknown],
          font: cardFontColorMap[newList[index] || CardType.unknown],
        };
      }
    }
    return newColorList;
  }, [cardList]);

  const rareMap: Record<string, number> = useMemo(() => {
    return list.reduce((pre: Record<string, number> , item) => {
      if (item?.rare) {
        if (!pre[item?.rare?.get() || '']) {
          pre[item.rare?.get() || ''] = 0;
        }
        pre[item.rare?.get() || ''] += 1;
      }
      return pre;
    }, {});
  }, [list]);

  const renderItem = (item: ProxyJson<CardItem> | null, index?: number) => {
    const count = (index !== undefined) ? <code className="inline-block opacity-60 min-w-[24px] mr-[2px]">{(hasSecret && index === (number - 1)) ? 'S1' : (fromZero ? index : index + 1)}</code> : null;
    return (
      <div className="min-h-[32px] h-full flex items-center">
        {item ? (
          <div className="p-1 px-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="text-left">
                  {count}
                  {/* <span>{item?.number}</span> */}
                  <span className={classNames({ 'underline decoration-dotted': item?.image })}>
                    {/* {item?.image ? <img alt={item?.name} src={item?.image} width={15} height={30} /> : null} */}
                    {/* {(item?.image) ? <Link href={item?.image}>{item?.name}</Link> : item?.name} */}
                    {/* {item?.name?.get()} */}
                    <EText value={item} render={(item) => item?.name} placeholder={hasAuth && <span>[+]</span>} />
                    <EText value={item.image} render={(item) => (hasAuth && <span className="ml-1">{item ? '[E]' : '[+]'}</span>)} />
                    {/* {item?.isNew ? <span className="ml-1 text-xs">[new]</span> : null} */}
                    {item?.rare?.get() ? <code className="ml-1 underline">[{item?.rare?.get()}]</code> : null}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="min-w-[300px] max-w-[500px]">
                  <div className="mb-2 font-bold">{item?.name?.get() || '--'}</div>
                  <div className="flex gap-6 items-start">
                    {item?.image?.get() ? <a href={item.image?.get()} target="_blank"><Image className="rounded-md min-w-[120px]" alt={item?.name?.get()} src={item?.image?.get() || ''} width={120} height={175} /></a> : null}
                    <div className="min-w-[300px] whitespace-pre-wrap">
                      <EText value={item?.desc} placeholder="--" />
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="min-h-[32px] w-full h-full px-2 flex items-center">
            {count}
          </div>
        )}
      </div>
    );
  }

  const viewList = new Array(number).fill(0).map((_, index) => {
    const item = cardList[index];
    return renderItem(item, index);
  });

  return (
    <EContainer>
    <div className="flex flex-col">
      <table className="border-collapse max-w-[1200px]">
        <tbody className="">
          {new Array(ROW).fill(0).map((_, row) => (
            <tr key={row} className="">
              {new Array(COL).fill(0).map((_, ceil) => (
                <td
                  key={ceil}
                  className={classNames({
                    'p-0 border-gray-800 text-start align-top min-h-[32px] w-[25%]': true,
                    border: ceil * ROW + row < number,
                    'brightness-90': !cardList[ceil * ROW + row],
                  })}
                  style={{
                    background: ceil * ROW + row < number
                      ? (cardList[ceil * ROW + row]?.pendulum && false)
                        ? `radial-gradient(circle at 150% 150%, #66CDAA, ${colorList[ceil * ROW + row]?.bg})`
                        : colorList[ceil * ROW + row]?.bg
                      : 'none',
                    color: colorList[ceil * ROW + row]?.font,
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
    </div>
    </EContainer>
  );
}

export default CardPackage;