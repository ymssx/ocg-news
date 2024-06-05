import fs from 'fs';
import path from 'path';

export async function getDataFileContent(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(fileContent);
    });
  });
}

export function getPackages() {
  const packagesPath = path.join(process.cwd(), '/data/package');
  const files = fs.readdirSync(packagesPath);

  const res: string[] = [];

  files.forEach(file => {
    const filePath = path.join(packagesPath, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isFile()) {
      res.push(file);
    }
  });

  return res.map(item => item.replace('.json', ''));
}

export function getYdkFiles(dir?: string, prefix: string[] = []) {
  const decksPath = dir || path.join(process.cwd(), '/data/decks');
  const files = fs.readdirSync(decksPath);

  const res: string[] = [];

  for (const file of files) {
      const filePath = path.join(decksPath, file);
      const stat = fs.statSync(filePath);
      const newPath = [...prefix, file];

      if (stat.isDirectory()) {
          const subRes = getYdkFiles(filePath, newPath);
          res.push(...subRes);
      } else if (path.extname(file) === '.ydk') {
          res.push(newPath.join('/'));
      }
  }
  return res.map(item => item.replace('.ydk', ''));
}

// export function getPackageImage(id: string) {
//   const packagesPath = path.join(process.cwd(), '/public/images/package');
//   const files = fs.readdirSync(packagesPath);

//   for (const file of files) {
//     const filePath = path.join(packagesPath, file);
//     const fileStats = fs.statSync(filePath);
//     if (fileStats.isFile() && file.split('.')[0].toLocaleLowerCase() === id.toLowerCase()) {
//       return file;
//     }
//   }
// }