const list = require('../data/diff/card.json');
const { updateDiffFile } = require('./update-diff.js');

const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

const instance = axios.create({
  headers: {
    'Dnt': '1',
    'Referer': 'https://yu-gi-oh.jp/news_detail.php',
    'Sec-Ch-Ua': '"Chromium";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  }
});

function calculateHash(data) {
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
}

async function downloadImage(url, directory) {
  try {
    const response = await instance.get(url, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(response.data, 'binary');

    const hash = calculateHash(imageData);
    // const extension = url.substring(url.lastIndexOf('.') + 1) || 'jpg';
    const extension = 'jpg';
    const fileName = `${hash}.${extension}`;
    const filePath = `${directory}/${fileName}`;

    fs.writeFileSync(filePath, imageData);

    return fileName;
  } catch (err) {
    throw new Error(`Failed to download image: ${err.message}`);
  }
}
async function cacheImages() {
  const imageList = list.filter((item) => {
    return item.image;
  });

  for (const item of imageList) {
    console.log(item.image);
    const imgSrc = await downloadImage(item.image, `./public/images/card`).catch(e => console.log(e));
    if (imgSrc) {
      item.image = `/images/card/${imgSrc}`;
    }
  }
  
  updateDiffFile(list, '@/data/diff/card.json');
}

cacheImages();