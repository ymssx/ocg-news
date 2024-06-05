const list = require('../data/diff/card.json');

const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

function calculateHash(data) {
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
}

async function downloadImage(url, directory) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    const hash = calculateHash(imageData);
    const extension = url.substring(url.lastIndexOf('.') + 1);
    const fileName = `${hash}.${extension}`;
    const filePath = `${directory}/${fileName}`;

    fs.writeFileSync(filePath, imageData);

    return fileName;
  } catch (err) {
    throw new Error(`Failed to download image: ${err.message}`);
  }
}
async function cacheImages() {
  await axios.get(`https://yu-gi-oh.jp/news_detail.php?page=details&id=1927`, { responseType: 'text/html' }).catch(e => {});
  const imageList = list.filter((item) => {
    return item.image;
  });

  for (const item of imageList) {
    console.log(item.image);
    await downloadImage(item.image, `./public/images/`).then(res => console.log(res)).catch(e => console.log(e));
  }
}

cacheImages();