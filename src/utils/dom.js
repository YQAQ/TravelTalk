/**
 * 获取当前dom距离滚动区域的高度
 * @param {*} e 要获取的dom元素
 */
export const getOffsetTop = (e) => {
  if (!e) {
    return 0;
  }
  let T = e.offsetTop;
  while ((e = e.offsetParent)) {
    T += e.offsetTop;
  }
  return T;
};

/**
 * 可滚动区域滚动到指定内部元素的位置
 * @param {*} scrollNode 滚动区域元素
 * @param {*} node 子元素
 */
export const scrollYTo = (scrollNode, node, options) => {
  if (!scrollNode || !node) {
    return false;
  }
  const { behavior = 'instant', offset = 0 } = options || {};
  const scrollTop = Math.abs(getOffsetTop(node) - getOffsetTop(scrollNode)) - offset;
  scrollNode.scrollTo({
    behavior,
    left: 0,
    top: scrollTop,
  });
};

/**
 * 判断一个元素是否是另一个元素的子元素
 * @param {element} child 子元素
 * @param {element} parent 父元素
 */
export const isChildOf = (child, parent) => {
  let parentNode;
  if (child && parent) {
    parentNode = child.parentNode;
    while (parentNode) {
      if (parent === parentNode) {
        return true;
      }
      parentNode = parentNode.parentNode;
    }
  }
  return false;
};
