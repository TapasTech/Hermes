export * as GraphqlRest from './graphql-rest';

export function encodeField(field) {
  return JSON.stringify(field);
};

export const timeFormatter = (data) => {
  const time = new Date(data).getTime();
  const now = Date.now();
  const timeDiff = now - time;
  if (timeDiff < 60*1000) {
    return '几秒前';
  } else if (timeDiff < 60*60*1000) {
    return `${~~(timeDiff/(60*1000))}分钟前`;
  } else if (timeDiff < 24*60*60*1000) {
    return `${~~(timeDiff/(60*60*1000))}小时前`;
  } else if (timeDiff < 30*24*60*60*1000) {
    return `${~~(timeDiff/(24*60*60*1000))}天前`;
  } else if (timeDiff < 12*30*24*60*60*1000) {
    return `${~~(timeDiff/(30*60*60*1000))}月前`;
  } else {
    return `${~~(timeDiff/(12*30*60*60*1000))}年前`;
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
