function getNameRare(text) {
  let rare = '';
  let name = '';

  const match = text.match(/\((.*?)\)(.*)/);

  if (match) {
    rare = match[1];
    name = match[2].replace(/\(.*?\)/g, '');
  } else {
    name = text;
  }

  return { name, rare };
}

function getPackageJson(text, packageId) {
  const list = text
    .split(packageId)
    .filter(item => item.trim())
    .map(originData => {
      const item = originData.trim();
      const parts = item.split('\n').filter(item => item.trim());
      const baseInfo = parts.shift()?.split(' ')?.filter(item => item.trim()) || [];
      const data = {
        id: '',
        number: `${packageId}${baseInfo[0]}`,
        ...getNameRare(baseInfo[1] || ''),
        desc: parts.join('\n'),
      };
      return data;
    });
    console.log(JSON.stringify(list));
    return list;
}

getPackageJson(`
LEDE-JP032  (R)フィッシュボーグ－ハープナー
(生化魚叉手)  協調/效果怪獸  4  水  魚族  400/400
此卡名的①效果一回合只能使用一次
①:展示手牌此卡與手牌水屬性怪獸1體可以發動。該2體怪獸中1體特殊召喚，另1體捨棄
②:此卡作為水屬性S怪獸S素材送墓的場合可以發動。對方場上效果怪獸1體這回合效果無效`, 'LEDE');