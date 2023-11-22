function isObject(item: any) {
  return (item && typeof item === "object" && !Array.isArray(item));
}

interface IObject {
  [key: string]: any;
}

function mergeDeep<T extends IObject, U extends IObject[]>(
  target: T,
  ...sources: U
) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export default mergeDeep;
