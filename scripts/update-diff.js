const fs = require('fs');

// 更新 JSON 文件的函数
function updateDiffFile(newData, _filePath, MAXLEN = 100) {
  const filePath = _filePath.replace('@', '.');
  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      console.error(`无法读取文件 ${filePath}: `, err);
      return;
    }

    try {
      const list = JSON.parse(fileContent) || [];
      const idSet = new Set();
      const time = new Date().getTime();
      const contactList = [
        ...newData.map(item => ({ ...item, time })),
        ...list,
      ];
      const newList = [];
      // 去重
      for (const item of contactList) {
        if (!idSet.has(item.id)) {
          newList.push(item);
          idSet.add(item.id);
          if (newList.length >= MAXLEN) {
            break;
          }
        }
      }
      const updatedContent = JSON.stringify(newList);

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

module.exports = {
  updateDiffFile,
}