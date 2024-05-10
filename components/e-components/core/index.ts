import { updateData, updatePackage } from "./api";

type JSON_TYPE = string | boolean | boolean | object;

interface HandleSaveParams {
  field: string;
  value: any;
  resolve: () => void;
  reject: (e: Error) => void;
}

interface Context {
  path: string;
  fullField?: string;
  json: object;
  handleSave: (params: HandleSaveParams) => void;
}

export type BaseItem<T> = { get: () => T, set: (val: T) => Promise<void>, __originData: T }

export type ProxyJson<T> = T extends object
  // ? T extends (infer Item)[]
  // ? ProxyJson<Item>[]
  ? (BaseItem<T> & {
    [key in keyof T]: T[key] extends object
      ? ProxyJson<T[key]>
      : BaseItem<T[key]>
  }) : BaseItem<T>

export function getJsonProxy<T extends object, F extends keyof T>(
  field: F | '',
  json: T,
  context: Context,
): (
  F extends keyof T
    ? ProxyJson<T[F]>
    : F extends ''
      ? T
      : undefined
) {
  let originData: any = field !== '' ? json[field] : json;
  let tempData = originData;

  function setValue(value: typeof originData) {
    if (value === originData) {
      console.log(field, value, '未修改');
      return Promise.resolve();
    }
    // 有全局管理的场景，走全局管理
    if (window._econtainer) {
      window._econtainer.addChange(context.path, context.fullField || '', value);
      // return Promise.resolve();
    }
    tempData = value;
    return new Promise<void>((resolve, reject) => {
      context.handleSave({
        field: context.fullField || '',
        value,
        resolve: () => {
          originData = tempData;
          resolve();
        },
        reject
      });
    });
  }

  if (typeof originData === 'object' && originData) {
    return new Proxy(originData, {
      get(_, key: string) {
        if (key === '__originData') {
          return originData;
        }
        if (key === 'get') {
          return function proxyGet() {
            return JSON.stringify(originData);
          };
        }
        if (key === 'set') {
          return function proxySet(val) {
            return setValue(val);
          }
        }
        if (Array.isArray(originData)) {
          if (key === 'filter') {
            return function(callback: (item, index: number) => any) {
              const proxyList = originData
                .map((_, index: number) => getJsonProxy(String(index), originData, {
                  ...context,
                  fullField: context.fullField ? `${context.fullField}.${index}` : String(index),
                }));
              return proxyList.filter((item, index: number) => callback(item, index));
            }
          }
          if (key === 'forEach') {
            return function(callback: (item, index: number) => any) {
              const proxyList = originData
                .map((_, index: number) => getJsonProxy(String(index), originData, {
                  ...context,
                  fullField: context.fullField ? `${context.fullField}.${index}` : String(index),
                }));
              return proxyList.forEach((item, index: number) => callback(item, index));
            }
          }
          if (key === 'map') {
            return function(callback: (item, index: number) => any) {
              const proxyList = originData
                .map((_, index: number) => getJsonProxy(String(index), originData, {
                  ...context,
                  fullField: context.fullField ? `${context.fullField}.${index}` : String(index),
                }));
              return proxyList.map((item, index: number) => callback(item, index));
            }
          }
          if (key === 'reduce') {
            return function(callback: (pre, item, index: number) => any, initData: any) {
              const proxyList = originData
                .map((_, index: number) => getJsonProxy(String(index), originData, {
                  ...context,
                  fullField: context.fullField ? `${context.fullField}.${index}` : String(index),
                }));
              return proxyList.reduce((pre, item, index: number) => callback(pre, item, index), initData);
            }
          }
        }
        
        return getJsonProxy(key, originData, {
          ...context,
          fullField: context.fullField ? `${context.fullField}.${key}` : key,
        });
      }
    });
  }

  return {
    get() {
      return originData;
    },
    set(val) {
      return setValue(val);
    },
    toString() {
      return originData;
    },
    __originData() {
      return originData;
    },
  } as any;
}

export function jsonHelper<T extends object>(path: string, json: T, config: { onChange?: (j: T) => void } = {}): ProxyJson<T> {
  let newJson = { ...json };
  let job: ReturnType<typeof setTimeout>;
  function handleSave({
    field,
    value,
    resolve,
    reject,
  }: HandleSaveParams) {
    let target = newJson;
    const key = field;
    const newData = value;
    if (!key) {
      target = newData;
      return;
    }
    const keys = key.split('.');
    if (keys.length === 1) {
      target[key] = newData;
    }
    let current = target;
    for (let index = 0; index < keys.length - 1; index += 1) {
      const currentKey = keys[index];
      if (current[currentKey] !== undefined) {
        current = current[currentKey];
      } else {
        throw new Error(`filed ${key} can\'t index json`, target);
      }
    }
    current[keys[keys.length - 1]] = newData;

    config?.onChange?.(newJson);

    if (window._econtainer) {
      resolve();
      return;
    }
    if (job) {
      clearTimeout(job);
    }
    job = setTimeout(() => {
      console.log('save', path, field);
      updateData(path, {
        name: path,
        data: JSON.stringify(newJson),
      })
        .then(() => resolve())
        .catch(e => reject(e));
    }, 100);
  }

  return getJsonProxy('', json, {
    path,
    json,
    handleSave,
  }) as any;
}

export type JSON_ITEM = ReturnType<typeof jsonHelper>;

export class Container {
  changeList: {
    [name: string]: Set<string>;
  } = {};

  changeMap: { [key: string]: JSON_TYPE } = {};

  changeCallbackList = new Set<() => void>();

  get hasChanged() {
    return Object.keys(this.changeMap || {}).length > 0;
  }

  addChange(name: string, field: string, content: JSON_TYPE) {
    const key = `${name}~~${field}`;
    this.changeMap[key] = content;
    if (!this.changeList[name]) {
      this.changeList[name] = new Set();
    }
    this.changeList[name].add(field);
    this.triggerChange();
  }

  onChange(callback) {
    this.changeCallbackList.add(callback);
    return () => {
      this.changeCallbackList.delete(callback);
    };
  }

  triggerChange() {
    this.changeCallbackList.forEach(callback => callback?.());
  }

  submit() {
    const data = {};
    for (const name in this.changeList) {
      data[name] = [...Array.from(this.changeList[name])]
        .reduce((pre, item) => ({
          ...pre,
          [item]: this.changeMap[`${name}~~${item}`],
        }), {});
    }
    return updatePackage(data)
      .then(() => {
        this.changeList = {};
        this.changeMap = {};
        this.triggerChange();
      });
  }
}
