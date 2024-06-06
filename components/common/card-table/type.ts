// 'normal' | 'effect' | 'ritual' | 'fusion' | 'synchro' | 'xyz' | 'pendulum' | 'link'
export enum CardType {
  unknown = 'unknown',
  spell = 'spell',
  trap = 'trap',
  monster = 'monster',
  // normal = 'normal', // 不区分通常、效果
  // effect = 'effect',
  ritual = 'ritual',
  fusion = 'fusion',
  synchro = 'synchro',
  xyz = 'xyz',
  // pendulum = 'pendulum',
  link = 'link',
}

export interface CardItem {
  id: string;
  name: string;
  type: CardType;
  number?: string;
  desc?: string;
  isNew?: boolean;
  image?: string;
  rare?: string;
  pendulum?: boolean;
}

export interface PackageData {
  id: string;
  name: string;
  desc: string;
  images?: string[];
  number: number;
  list: CardItem[];
  lastUpdate?: number;
}