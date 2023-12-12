'use client';
import { useRef } from "react";

const ParaTool = () => {
  const res = useRef('');
  return (
    <div>
      <textarea className="bg-gray-50 w-full" onChange={e => res.current = e?.target?.value?.split('\n')?.join('\\n')?.trim()} />
      <button onClick={() => {
        window.navigator?.clipboard
          ?.writeText(res.current)
          .then(() => {
            // message.success('copied');
          })
          .catch((e) => {
            console.error(e);
            // message.error(e);
          });
      }}>Copy</button>
    </div>
  );
};

export default ParaTool;