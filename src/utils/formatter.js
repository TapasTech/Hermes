export const time = (data) => {
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

export const url = (string) => {
  const regex = /:\/\//;
  if (regex.test(string)) {
    return string;
  } else {
    return `http://${string}`;
  }
}
