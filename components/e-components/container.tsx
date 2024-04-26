import { ReactNode, useEffect, useState } from "react";
import { Container } from "./core";

export default function EContainer({ children }: { children: ReactNode }) {
  const [changed, setChanged] = useState(false);
  
  useEffect(() => {
    if (!window._econtainer) {
      window._econtainer = new Container();
    }
    const remover = window._econtainer.onChange(() => {
      setChanged(window._econtainer.hasChanged);
    });
    return () => {
      remover();
    };
  }, []);

  const handleSubmit = () => {
    window._econtainer?.submit?.();
  };

  return (
    <div>
      {changed && (
        <div className="flex justify-between border-b px-4 py-4">
          <div>文件内容已修改</div>
          <button className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded-sm" onClick={handleSubmit}>Submit</button>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}