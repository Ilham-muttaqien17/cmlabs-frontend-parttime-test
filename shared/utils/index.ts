/**
 * Create url parameters
 * https://stackoverflow.com/questions/56173848/want-to-convert-a-nested-object-to-query-parameter-for-attaching-to-url
 * @param {object} data Data to create url query
 * @returns String
 */
export function createUrlParams(data?: Record<string, any>): string {
  if (!data) return '';
  const replaceKey = (str: string) => (str === '__proto__' || str === 'constructor' ? '_proto' : str);
  const getPairs = (obj: Record<string, any>, keys: any[] = []) => {
    return Object.entries(obj).reduce((pairs: any[], [key, value]: any[]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          pairs.push([[...keys, replaceKey(key)], encodeURIComponent(v)]);
        });
      } else if (typeof value === 'object') {
        pairs.push(...getPairs(value, [...keys, replaceKey(key)]));
      } else {
        pairs.push([[...keys, replaceKey(key)], encodeURIComponent(value)]);
      }
      return pairs;
    }, []);
  };

  const mapped = getPairs(data).map(([[key, ...keysRest], value]: any[]) => {
    return `${replaceKey(key)}${keysRest.map((k: string) => `[${replaceKey(k)}]`).join('')}=${value ?? ''}`;
  });

  return mapped.filter((v) => v.split('=')[1] !== '').join('&');
}

/**
 * Parse to array
 * @param val - any
 * @returns Array
 */
export const toArray = <T = any>(val: any, isAssign: boolean = false): T[] => {
  return Array.isArray(val) ? val : isAssign ? [val] : [];
};

/**
 * Uppercase first character in word
 * @param str Value to convert
 * @returns string
 */
export function ucFirst(str: string): string {
  return typeof str === 'string'
    ? str
        .replace(/[^a-zA-Z]/g, ' ') // Replace all non-alphabets with whitespace
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
    : '';
}

/**
 * Remove properties from object
 * @param source - Source data in object
 * @param keys - Array of keys wants to delete
 * @returns Object
 */
export function omit<T extends Record<string, any>>(source: T, keys: (keyof T)[]) {
  return Object.keys(source).reduce((prev: Record<string, any>, curr) => {
    if (keys.indexOf(curr) === -1) {
      prev[curr] = source[curr];
    }

    return prev;
  }, {}) as T;
}

/**
 * Chunk array
 * @param array - Array of T
 * @param size - size of per chunk
 * @returns Array of T[]
 */
export function chunkArray<T = any>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
