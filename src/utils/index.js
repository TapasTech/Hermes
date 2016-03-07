export * as GraphqlRest from './graphql-rest';

export function encodeField(field) {
  return JSON.stringify(field);
};

export const timeFormatter = (data) => {
  const time = new Date(data).getTime();
  const now = Date.now();
  const timeDiff = now - time;
  const detail = new Date(timeDiff);
  if (timeDiff < 60*1000) {
    return '几秒前';
  } else if (timeDiff < 60*60*1000) {
    return `${detail.getMinutes()}分钟前`;
  } else if (timeDiff < 60*60*60*1000) {
    return `${detail.getHours()}小时前`;
  } else if (timeDiff < 24*60*60*60*1000) {
    return `${detail.getDate()}天前`;
  } else if (timeDiff < 30*24*60*60*60*1000) {
    return `${detail.getMonth() + 1}月前`;
  } else if (timeDiff < 12*30*24*60*60*60*1000) {
    return `${detail.getFullYear()}年前`;
  } else {
    return '很久很久以前';
  }
}

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
