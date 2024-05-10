import { useMemo, useState } from 'react';
import { ProxyJson, jsonHelper } from './index';

export function useJson<T extends object>(path: string, _json: T): [T, ProxyJson<T>] {
  const [json, setJson] = useState(_json);
  const proxyJson = useMemo(() => jsonHelper(path, json, {
    onChange: (newJson) => {
      setJson({ ...newJson });
    },
  }), [json])
  return [json, proxyJson];
}
