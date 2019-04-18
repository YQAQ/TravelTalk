/**
 * create an object composed of the own and inherited
 * enumerable properties of object that are not omitted
 * @param  {Object} obj   The source object
 * @param  {Array}  props property names
 * @return {Object} The new object
 */
const omit = (obj = {}, props = []) => {
  if (!Array.isArray(props)) {
    throw Error('props type error!');
  }
  const keys = Object.keys(obj);
  const res = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (!props || !props.includes(key)) {
      res[key] = value;
    }
  }
  return res;
};

export default omit;
