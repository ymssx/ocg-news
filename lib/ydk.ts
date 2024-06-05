export function transYdk<T extends { [key: string]: string[] | string }>(content: string) {
  const res: { [key: string]: string[] | string } = {};
  let currentLabel = '';
  let currentValue: string[] = [];
  content
    .trim()
    .split('\n')
    .filter(item => item)
    .forEach(_item => {
      const item = _item.trim();
      if (item.length > 1 && ['#', '!'].includes(item[0])) {
        const label = item.split(item[0])[1];
        if (label) {
          if (currentLabel) {
            res[currentLabel] = currentValue.length === 1 ? currentValue[0] : [...currentValue];
            currentValue = [];
          }
          currentLabel = label;
        }
      } else {
        currentValue.push(item);
      }
    });
  if (currentValue.length) {
    if (currentLabel) {
      res[currentLabel] = currentValue;
    } else if (!('main' in res)) {
      res['main'] = currentValue;
    }
  }
  return res as T;
}