const sizeConfig = {
  Ring: {
    small: {
      width: 12,
      height: 12,
    },
    large: {
      width: 24,
      height: 24,
    },
  },
  Line: {
    small: {
      width: 24,
      height: 30,
    },
    large: {
      width: 24,
      height: 30,
    },
  },
  Rolling: {
    small: {
      width: 40,
      height: 40,
    },
    large: {
      width: 40,
      height: 40,
    },
  },
};

export default (shape, size) => {
  return sizeConfig[shape][size];
};
