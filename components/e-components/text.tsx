import { ReactNode, useEffect, useRef, useState } from 'react';
import { ProxyJson } from './core/index';
import { hasAuth } from './core/auth';

interface Props<T extends ProxyJson<any>> {
  value: undefined | (T extends { get: any; set: any } ? T : never);
  render?: (value: any, context: { start: () => void }) => string | ReactNode;
  placeholder?: ReactNode | string;
  getData?: (data: string) => string;
  setData?: (data: string, originData: any) => any;
}

export default function EText<T extends ProxyJson<any>>(props: Props<T>) {
  const {
    value,
    render = value => value,
    placeholder,
    getData,
    setData,
  } = props;

  const [editMode, _setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(value?.get());
  const [saveLoading, setSaveLoading] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);

  const isObj = typeof value?.__originData === 'object';

  useEffect(() => {
    if (value?.get() !== tempValue) {
      setTempValue(value?.get());
    }
  }, [value?.get()]);

  const setEditMode = (val) => {
    if (!hasAuth()) {
      window.open('/github-auth');
      return;
    }
    _setEditMode(val);
  };

  useEffect(() => {
    editMode && contentRef.current?.focus?.();
  }, [editMode]);

  if (!(typeof value === 'object')) {
    return value;
  }

  if (!editMode) {
    const view = render(isObj ? JSON.parse(tempValue) : tempValue, {
      start() {
        setEditMode(true);
      }
    });
    return (
      <span onDoubleClick={() => setEditMode(true)}>
        <span>{view ? view : placeholder}</span>
        {/* <span onClick={() => setEditMode(true)}>edit</span> */}
      </span>
    );
  }

  const handleCancel = () => {
    // setTempValue(tempValue);
    setEditMode(false);
  };
  const handleSave = () => {
    const innerText = contentRef.current?.innerText || '';
    let newVal = innerText;
    if (setData) {
      newVal = setData(newVal, value.__originData);
    } else {
      if (isObj) {
        newVal = JSON.parse(newVal || '{}');
      }
    }
    setTempValue(innerText);
    setSaveLoading(true);
    value.set(newVal)
      .then(() => {
        setEditMode(false);
      })
      .catch(() => {
        setTempValue(value.get());
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  return (
    <>
      <span className="inline-block"></span>
      <span
        ref={contentRef}
        contentEditable={!saveLoading}
        suppressContentEditableWarning
        className="outline-green-600 focus:bg-green-600 focus:bg-opacity-10 whitespace-pre-wrap"
      >
        {getData ? getData(tempValue) : tempValue}
      </span>
      <div className="flex gap-2 my-2 text-base font-normal text-black">
        <button className="py-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-sm" disabled={saveLoading} onClick={handleCancel}>Cancel</button>
        <button className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded-sm" disabled={saveLoading} onClick={handleSave}>{saveLoading ? 'Loading ' : ''}Confirm</button>
      </div>
    </>
  );
}