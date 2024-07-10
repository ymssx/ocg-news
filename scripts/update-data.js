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
function updateJsonFile(_filePath, data, config) {
  const filePath = _filePath.replace('@', '.');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }
  
      try {
        const json = JSON.parse(fileContent);
        const updatedJson = updateNestedFields(json, data, config);
        updatedJson.lastUpdate = new Date().getTime();
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

function updateObject(data, key, value, config = {}) {
  // 融合模式会保留原始数据
  if (config.merge) {
    if (Array.isArray(data[key]) && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (data[key][index]) {
          if (typeof item === 'object') {
            data[key][index] = {
              ...data[key][index],
              ...item,
            };
          } else {
            data[key][index] = item;
          }
        } else {
          data[key].push(item);
        }
      });
    } else if (typeof data[key] === 'object' && typeof value === 'object') {
      data[key] = { ...data[key], ...value };
    } else {
      data[key] = value;
    }
  } else {
    data[key] = value;
  }
}

// 递归更新嵌套字段的函数
function updateNestedFields(_target, changeMap, config) {
  let target = _target;
  for (const key in changeMap) {
    const newData = changeMap[key];
    if (!key) {
      target = newData;
      break;
    }
    const keys = key.split('.');
    if (keys.length === 1) {
      updateObject(target, key, newData, config);
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
    updateObject(current, keys[keys.length - 1], newData, config);
  }
  return target;
}


async function update(jsonData, config) {
  const job = [];
  // 遍历并更新每个文件的 JSON 内容
  for (const filePath in jsonData) {
    const data = jsonData[filePath];
    job.push(updateJsonFile(filePath, data, config));
  }
  return Promise.all(job);
}

module.exports = {
  update,
};
