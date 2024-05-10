const fs = require('fs');
const { update } = require('./update-data.js');
const { updateDiffFile } = require('./update-diff.js');

function readJson(_filePath) {
  const filePath = _filePath.replace('@', '.');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }
      const json = JSON.parse(fileContent);
      resolve(json);
    });
  });
}

async function parseChanges(jsonData) {
  let res = [];
  const regex = /list\.(\d+)/;
  for (const filePath in jsonData) {
    const data = jsonData[filePath];
    const addedSet = new Set();
    const listData = (await readJson(filePath)).list || [];
    for (const key in data) {
      if (key === 'list') {
        res = [
          ...res,
          ...listData.filter(item => item.name),
        ];
        break;
      }
      const match = key.match(regex);
      if (match && match[1]) {
        const number = parseInt(match[1]);
        if (!addedSet.has(number) && listData[number]?.name) {
          res = [
            ...res,
            listData[number],
          ];
          addedSet.add(number);
        }
      }
    }
  }
  updateDiffFile(res.map(item => ({
    ...item,
    id: item.number,
  })), '@/data/diff/card.json');
}


// // 要更新的 JSON 数据
// const jsonData = {
//   "@/data/package/info.json": {
//     "list.30": {
//       "desc": "",
//       "name": "面子蝙蝠",
//       "number": "INFO-JP030",
//       "type": "monster"
//     },
//     "name": "123123",
//     "list.31.desc": "????"
//   }
// };

const changeMap = JSON.parse(process.argv[2] || '{}');
update(changeMap)
  .then(() => {
    parseChanges(changeMap);
  });