import fs from 'fs';
import path from 'path';

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

export function getPackageImage(id: string) {
  const packagesPath = path.join(process.cwd(), '/public/images/package');
  const files = fs.readdirSync(packagesPath);

  for (const file of files) {
    const filePath = path.join(packagesPath, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isFile() && file.split('.')[0].toLocaleLowerCase() === id.toLowerCase()) {
      return file;
    }
  }
}