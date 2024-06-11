import path from 'path';
import sqlite3 from 'sqlite3';

const MAP = {
  type: {
    2: ['spell', 'normal', '', ''],
    4: ['trap', 'normal', '', ''],
    17: ['monster', 'normal', '', ''],
    33: ['monster', 'effect', '', ''],
    65: ['monster', 'fusion', 'normal', ''],
    97: ['monster', 'fusion', '', ''],
    129: ['monster', 'ritual', 'normal', ''],
    130: ['spell', 'ritual', '', ''],
    161: ['monster', 'ritual', '', ''],
    545: ['monster', 'effect', 'nm', ''],
    673: ['monster', 'ritual', 'spirit', ''],
    1057: ['monster', 'effect', 'union', ''],
    2081: ['monster', 'effect', 'gemini', ''],
    8193: ['monster', 'synchro', 'normal', ''],
    8225: ['monster', 'synchro', '', ''],
    4113: ['monster', 'normal', 'tunner', ''],
    4129: ['monster', 'effect', 'tunner', ''],
    4161: ['monster', 'fusion', 'tunner', 'normal'],
    5153: ['monster', 'effect', '画nion', 'tunner'],
    12321: ['monster', 'synchro', 'tunner', ''],
    16401: ['monster', 'token', '', ''],
    65538: ['spell', 'quick', '', ''],
    131074: ['spell', 'continuous', '', ''],
    131076: ['trap', 'continuous', '', ''],
    262146: ['spell', 'equip', '', ''],
    524290: ['spell', 'field', '', ''],
    1048580: ['trap', 'counter', '', ''],
    2097185: ['monster', 'effect', 'flip', ''],
    2101281: ['monster', 'effect', 'flip', 'tunner'],
    4194337: ['monster', 'effect', 'toon', ''],
    8388609: ['monster', 'xyz', 'normal', ''],
    8388641: ['monster', 'xyz', '', ''],
    16777249: ['monster', 'effect', 'pendulum', ''],
    16777233: ['monster', 'normal', 'pendulum', ''],
    16777313: ['monster', 'fusion', 'pendulum', ''],
    16777761: ['monster', 'effect', 'pendulum', 'spirit'],
    16781329: ['monster', 'normal', 'pendulum', 'tunner'],
    16781345: ['monster', 'effect', 'pendulum', 'tunner'],
    16785441: ['monster', 'synchro', 'pendulum', ''],
    18874401: ['monster', 'effect', 'pendulum', 'flip'],
    25165857: ['monster', 'xyz', 'pendulum', ''],
    33554465: ['monster', 'effect', 'special', ''],
    33554977: ['monster', 'effect', 'spirit', 'special'],
    33558561: ['monster', 'effect', 'tunner', 'special'],
    37748769: ['monster', 'effect', 'toon', 'special'],
    50331681: ['monster', 'effect', 'pendulum', 'special'],
    67108865: ['monster', 'link', 'normal', ''],
    67108897: ['monster', 'link', '', ''],
  },
  attribute: {
    0: "trap",
    1: "earth",
    2: "water",
    4: "fire",
    8: "wind",
    16: "light",
    32: "dark",
    64: "divine",
  },
  race: {
    1: "warrior",
    2: "spellcaster",
    4: "fairy",
    8: "fiend",
    16: "zombie",
    32: "machine",
    64: "aqua",
    128: "pyro",
    256: "rock",
    512: "wingedbeast",
    1024: "plant",
    2048: "insect",
    4096: "thunder",
    8192: "dragon",
    16384: "beast",
    32768: "beastwarrior",
    65536: "dinosaur",
    131072: "fish",
    262144: "seaserpent",
    524288: "reptile",
    1048576: "psychic",
    2097152: "divinebeast",
    4194304: "divine",
    8388608: "wyrm",
    16777216: "cyberse",
  },
  level(num) {
    if (num < 13) {
        return num;
    } else {
      const binNum = num.toString(2);
      return parseInt(binNum.substr(binNum.length - 4, binNum.length - 1), 2);
    }
  }
}

export const variation = function(data) {
  if (Object.keys(data).length === 0) {
    return false;
  }

  let {id, atk, def, race, type, level, attribute, name, desc} = data;
  let [type1, type2, type3, type4] = MAP.type[type];
  let lb_num, lb_desc;
  attribute = MAP.attribute[attribute];
  race = MAP.race[race];
  level = MAP.level(level);
  if (type3 === "lb") {
    lb_num = parseInt(desc.substr(1));
    let temp = desc.split("→")[1];
    if (temp) {
      lb_desc = temp.split("【")[0].trim().replace(/\r?\n/g, '');
      desc = temp.split("】")[1].trim();
    }
  }
  desc = desc.replace(/(.*?\r?\n)/g, (line, _, pos) => ['fusion', 'synchro', 'xyz', 'link'].includes(type2) && pos === 0 ? line : line.trim());

  atk = (atk === -2) ? '?' : atk;
  def = (def === -2) ? '?' : def;
  
  return {
    _id: String(id),
    name,
    type: type1,
    type2: type2,
    type3: type3,
    type4: type4,
    attack: atk,
    defend: def,
    race,
    level,
    attribute,
    desc,
    lb_num,
    lb_desc
  }
}

export const transType = function(originData) {
  const data = {
    ...originData,
  };

  if (Array.isArray(data.types)) {
    data.type = data.types[0];
    data.type2 = data.types[1];
    data.type3 = data.types[2];
    data.type4 = data.types[3];
  }

  if (data.type2) {
    if (typeMap[data.type2]) {
      data.type2 = typeMap[data.type2];
    }
  }
  if (data.type3) {
    if (typeMap[data.type3]) {
      data.type3 = typeMap[data.type3];
    }
  }
  if (data.type4) {
    if (typeMap[data.type4]) {
      data.type4 = typeMap[data.type4];
    }
  }
  return data;
}

export function getFinalType(type1, type2) {
  if (type1 === 'monster') {
    if (['ritual', 'fusion', 'synchro', 'xyz', 'link'].includes(type2)) {
      return type2;
    }
  }
  return type1;
}

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
      ...variation(data),
      id,
    }));
};

export const getDataByRule = function(dbPath, rule) {
  return queryData(
    dbPath,
    `SELECT t.id, t.name, t.desc, d.atk, d.def, d.race, d.type, d.level, d.attribute FROM texts t, datas d WHERE t.id = d.id AND ${Object.keys(rule).map(key => `t.${key} = '${rule[key]}'`).join(' AND ')}`,
  )
    .then(data => ({
      ...variation(data || {}),
      id: data?._id,
    }));
}

export const getMultiDataByRules = function(dbPath, rules) {
  return Promise.all(rules.map(async rule => getDataByRule(dbPath, rule)));
};

export const getMultiDataByField = function(dbPath, field, list) {
  if (typeof list === 'string') list = JSON.parse(list);

  const dataMap = {};

  return Promise.all(Array.from(new Set(list)).map(async item => {
    const data = await getDataByRule(dbPath, { [field]: item }).catch(e => {});
    dataMap[item] = data;
  }))
    .then(() => {
      return list.map(item => dataMap[item]);
    });
};

export const getMultiData = function(dbPath, ids) {
  return getMultiDataByField(dbPath, 'id', ids);
}
export const getMultiDataByNames = function(dbPath, names) {
  return getMultiDataByField(dbPath, 'name', names);
}

export const getDbPath = (lang = 'ja-JP') => `./data/cdb/${lang}/cards.cdb`;


export const getCardData = async function(id, lang = 'ja-JP') {
  return getData(getDbPath(lang), id);
}


export const getCardList = async function(ids, lang = 'ja-JP') {
  return getMultiData(getDbPath(lang), ids);
}

export const getCardListByNames = async function(names, lang = 'ja-JP') {
  return getMultiDataByNames(getDbPath(lang), names);
}