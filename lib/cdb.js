import path from 'path';
import sqlite3 from 'sqlite3';

const dbMap = {};

export const queryData = function(dbPath, sql) {
  if (!dbMap[dbPath]) {
    const fullPath = path.join(process.cwd(), dbPath);
    dbMap[dbPath] = new sqlite3.Database(fullPath);
  }

  const db = dbMap[dbPath];

  return new Promise((resolve, reject) => {
    db.get(sql, function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(row);
      }      
    });
  });
}

export const queryDataList = function(dbPath, sql) {
  if (!dbMap[dbPath]) {
    dbMap[dbPath] = new sqlite3.Database(dbPath);
  }

  const db = dbMap[dbPath];

  return new Promise((resolve, reject) => {
    db.all(sql, function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(row);
      }      
    });
  });
}

export const getData = function(dbPath, id) {
  return queryData(
    dbPath,
    `SELECT t.id, t.name, t.desc, d.atk, d.def, d.race, d.type, d.level, d.attribute FROM texts t, datas d WHERE t.id = d.id AND t.id = '${id}'`,
  )
    .then(data => ({
      ...data,
      id,
    }));
};


export const getMultiData = function(dbPath, ids) {
  if (typeof ids === 'string') ids = JSON.parse(ids);

  const idDataMap = {};

  return Promise.all(Array.from(new Set(ids)).map(async id => {
    const data = await getData(dbPath, id);
    idDataMap[id] = data;
  }))
    .then(() => {
      return ids.map(id => idDataMap[id]);
    });
};


export const getCardData = async function(id, lang = 'ja-JP') {
  return getData(`./data/cdb/${lang}/cards.cdb`, id);
}


export const getCardList = async function(ids, lang = 'ja-JP') {
  return getMultiData(`./data/cdb/${lang}/cards.cdb`, ids);
}
