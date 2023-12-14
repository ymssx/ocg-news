import { CardType } from "./type";

export const cardColorMap = {
  [CardType.unknown]: '#ddd',
  [CardType.spell]: '#66CDAA',
  [CardType.trap]: '#f396d0',
  // [CardType.normal]: '#FAFAD2',
  // [CardType.effect]: '#FFDAB9',
  [CardType.monster]: '#FFDAB9',
  [CardType.ritual]: '#63B8FF',
  [CardType.fusion]: '#b288d3',
  [CardType.synchro]: '#F0F0F0',
  [CardType.xyz]: '#444',
  [CardType.link]: '#104E8B',

}

export const cardFontColorMap = {
  [CardType.unknown]: 'black',
  [CardType.spell]: 'black',
  [CardType.trap]: 'black',
  // [CardType.normal]: 'black',
  // [CardType.effect]: 'black',
  [CardType.monster]: 'black',
  [CardType.ritual]: 'black',
  [CardType.fusion]: 'black',
  [CardType.synchro]: 'black',
  [CardType.xyz]: 'white',
  [CardType.link]: 'white',
}