const fs = require('fs');

// 更新 JSON 文件的函数
function updateDiffFile(newData, _filePath, MAXLEN = 20) {
  const filePath = _filePath.replace('@', '.');
  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      console.error(`无法读取文件 ${filePath}: `, err);
      return;
    }

    try {
      const list = JSON.parse(fileContent) || [];
      const idSet = new Set();
      const contactList = [
        ...newData,
        ...list,
      ];
      const newList = [];
      // 去重
      for (let index = contactList.length - 1; index >= 0; index -= 1) {
        const item = contactList[index];
        if (!idSet.has(item.id)) {
          newList.unshift(item);
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