'use client';
import { useRef } from "react";
import { getPackageJson } from '@/scripts/pull';

const ParaTool = () => {
  const value = useRef('');
  return (
    <div className="flex flex-col gap-8">
      <textarea className="bg-gray-50 w-full h-[500px]" onChange={e => value.current = e?.target?.value} />
      <button onClick={() => {
        window.navigator?.clipboard
          ?.writeText(value.current?.split('\n')?.join('\\n')?.trim())
          .then(() => {
            // message.success('copied');
          })
          .catch((e) => {
            console.error(e);
            // message.error(e);
          });
      }}>Copy</button>
      <button onClick={() => {
        const cards = value.current
          .split('\n')
          .map(item => item.trim())
          .map(item => ({
            "id": "",
            "number": "ZZZZ-JP0",
            "name": item,
            "image": "",
            "type": "monster"
          }));
        window.navigator?.clipboard
          ?.writeText(JSON.stringify(cards))
          .then(() => {
            // message.success('copied');
          })
          .catch((e) => {
            console.error(e);
            // message.error(e);
          });
      }}>List2JSON</button>
      <button onClick={() => {
        const parts = value.current.split('\n');
        const packageId = parts.shift();
        const realText = parts.join('\n');
        const cards = getPackageJson(realText, packageId);
        window.navigator?.clipboard
          ?.writeText(JSON.stringify(cards))
          .then(() => {
            // message.success('copied');
          })
          .catch((e) => {
            console.error(e);
            // message.error(e);
          });
      }}>Text2JSON</button>
      <button
        onClick={() => {
          const json = JSON.parse(value.current || "{}");
          const name = json.id;
          const oldList = json.list || [];
          const newList: any[] = [];
          const fix = json.fromZero ? 0 : 1;
          oldList.forEach(item => {
            const index = (item.number?.match(/\d+$/)[0] || 1) - fix;
            newList[index] = item;
          })
          const number = json.number;
          let start = fix;
          for (let i = start; i <= (number - fix); i += 1) {
            if (!newList[i]) {
              newList[i] = {
                number: `${name}-jp${i.toString().padStart(3, '0')}`,
                name: '',
                desc: '',
              };
            }
          }
          json.list = newList;
          console.log(json.list);
          window.navigator?.clipboard
            ?.writeText(JSON.stringify(json))
            .then(() => {
              // message.success('copied');
            })
            .catch((e) => {
              console.error(e);
              // message.error(e);
            });
        }}
      >
        FullJson
      </button>
    </div>
  );
};

export default ParaTool;