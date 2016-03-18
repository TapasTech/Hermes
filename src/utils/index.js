export * as GQL from './graphql';
export * as formatter from './formatter';

export function encodeField(field) {
  return JSON.stringify(field);
};

export function hashColor(string) {
  let hash = 0;
  for (let i in string) {
    hash = hash * 6147 + string.charCodeAt(0);
    hash &= 0xffffff;
  }
  let color = hash.toString(16);
  while (color.length < 6) color = '0' + color;
  return '#' + color;
};
