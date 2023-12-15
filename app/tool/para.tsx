'use client';
import { useRef } from "react";

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
      }}>JSON</button>
    </div>
  );
};

export default ParaTool;