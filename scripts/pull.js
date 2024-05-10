function getNameRare(text) {
  let rare = '';
  let name = '';

  const match = text.match(/^\((.*?)\)(.*)/);

  if (match) {
    rare = match[1];
    name = match[2].split('(')[0];
  } else {
    name = text;
  }

  return { name: name.replace(/#114514#/g, ' ').split('(')[0], rare };
}

function removeBracketContent(string) {
  const pattern = /\([^()]*\)/g;
  const result = string.replace(pattern, '');
  return result;
}

function padZeros(number, length) {
  return String(number).padStart(length, '0');
}

export function getPackageJson(text, packageId, number, fromZero) {
  const list = new Array(number).fill(1).map((_, index) => ({
    id: '',
    number: `${packageId.toUpperCase()}-JP${padZeros(index + (fromZero ? 0 : 1), 3)}`,
    type: '',
    name: '',
    rare: '',
    desc: '',
  }));
  text
    .split(packageId)
    .filter(item => item.trim())
    .forEach(originData => {
      const item = originData.trim();
      const parts = item.split('\n').filter(item => item.trim());
      const baseInfo = parts.shift()?.split(' ')?.filter(item => item.trim()) || [];
      const oneline = baseInfo.length > 2 && !parts[0];
      const type = (function() {
        const raw = oneline ? baseInfo[2] : removeBracketContent(parts[0] || '');
        if (raw.includes('融合')) {
          return 'fusion';
        } else if (raw.includes('XYZ')) {
          return 'xyz';
        } else if (raw.includes('同步')) {
          return 'synchro';
        } else if (raw.includes('連結')) {
          return 'link';
        } else if (raw.includes('儀式')) {
          return 'ritual';
        } else if (raw.includes('怪獸')) {
          return 'monster';
        } else if (raw.includes('魔法')) {
          return 'spell';
        } else if (raw.includes('陷阱')) {
          return 'trap';
        } else {
          return oneline ? 'monster' : '';
        }
      })();
      const numberString = baseInfo.shift();
      const data = {
        id: '',
        number: `${packageId}${numberString}`,
        type,
        ...getNameRare(baseInfo.join('#114514#') || ''),
        desc: parts.join('\n'),
      };
      const index = Number(numberString.replace('-JP', ''));
      if (!isNaN(index)) {
        list[index - (fromZero ? 0 : 1)] = data;
      } else {
        list.push(data);
      }
    });
    console.log(JSON.stringify(list));
    return list;
}