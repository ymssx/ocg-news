const fs = require('fs');

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
//     "list.30.desc": "????"
//   }
// };

// 更新 JSON 文件的函数
function updateJsonFile(_filePath, data) {
  const filePath = _filePath.replace('@', '.');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }
  
      try {
        const json = JSON.parse(fileContent);
        const updatedJson = updateNestedFields(json, data);
        const updatedContent = JSON.stringify(updatedJson, null, 2);
  
        fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}

// 递归更新嵌套字段的函数
function updateNestedFields(_target, changeMap) {
  let target = _target;
  for (const key in changeMap) {
    const newData = changeMap[key];
    if (!key) {
      target = newData;
      break;
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
  }
  return target;
}


async function update(jsonData) {
  const job = [];
  // 遍历并更新每个文件的 JSON 内容
  for (const filePath in jsonData) {
    const data = jsonData[filePath];
    job.push(updateJsonFile(filePath, data));
  }
  return Promise.all(job);
}

module.exports = {
  update,
};
