const fs = require('fs');

// 要更新的 JSON 数据
const jsonData = {
  "@/data/package/info.json": {
    "name": "213123123",
    "desc": "12312312312312",
    "list.10.name": "123qewq"
  }
};

// 更新 JSON 文件的函数
function updateJsonFile(_filePath, data) {
  const filePath = _filePath.replace('@', '.');
  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      console.error(`无法读取文件 ${filePath}: `, err);
      return;
    }

    try {
      const json = JSON.parse(fileContent);
      const updatedJson = updateNestedFields(json, data);
      const updatedContent = JSON.stringify(updatedJson, null, 2);

      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.error(`无法写入文件 ${filePath}: `, err);
        } else {
          console.log(`已成功更新文件 ${filePath}`);
        }
      });
    } catch (err) {
      console.error(`无法解析文件 ${filePath} 的 JSON 内容: `, err);
    }
  });
}

// 递归更新嵌套字段的函数
function updateNestedFields(obj, data) {
  for (const key in data) {
    if (key.includes('.')) {
      const [nestedKey, nestedIndex, nestedField] = key.split('.');
      const index = parseInt(nestedIndex, 10);
      if (Array.isArray(obj[nestedKey]) && typeof index === 'number' && index >= 0) {
        if (obj[nestedKey][index] && typeof obj[nestedKey][index] === 'object') {
          obj[nestedKey][index][nestedField] = data[key];
        } else {
          console.error(`无法更新字段 ${key}，索引超出范围或对象不存在`);
        }
      } else {
        console.error(`无法更新字段 ${key}，不是有效的嵌套属性`);
      }
    } else {
      obj[key] = data[key];
    }
  }
  return obj;
}


function update(jsonData) {
  // 遍历并更新每个文件的 JSON 内容
  for (const filePath in jsonData) {
    const data = jsonData[filePath];
    updateJsonFile(filePath, data);
  }
}

update(JSON.parse(process.argv[2] || '{}'));
