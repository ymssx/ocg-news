'use client';

import { useJson } from "@/components/e-components/core/hooks";
import EText from "@/components/e-components/text";

const InfoPage = ({ data: _data }) => {
  const [originDara, data] = useJson<{ cover: string }>('@/home.json', _data);

  return (
    <div>
      <EText value={data.cover} render={(item) => (<img className="rounded-lg h-[300px]" src={item} alt="cover" />)} />
    </div>
  );
}

export default InfoPage;