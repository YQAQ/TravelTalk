const getImgSuffix = (w, h, type = 'center') => {
  if (typeof w !== 'number' || typeof h !== 'number') {
    return '';
  }
  const baseSuffix = `@base@tag=imgScale&h=${h}&w=${w}&rotate=0`;
  let c;
  let m;
  if (type === 'center' || type === 'fixed-w') {
    c = 1;
    m = 2;
  } else if (type === 'fixed-h') {
    c = 0;
    m = 2;
  } else {
    c = 0;
    m = 0;
  }
  return `${baseSuffix}&c=${c}&m=${m}`;
};

export default getImgSuffix;
